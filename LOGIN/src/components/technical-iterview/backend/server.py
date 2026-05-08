from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json
from dotenv import load_dotenv
import logging

# Google auth for service account token
try:
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request as GoogleRequest
    GOOGLE_AUTH_AVAILABLE = True
except Exception:
    GOOGLE_AUTH_AVAILABLE = False

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Technical Interview Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000", "*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

class ReviewRequest(BaseModel):
    code: str
    problemTitle: str = ""


class ChatRequest(BaseModel):
    message: str
    userContext: dict = None


def call_gemini(prompt: str, temperature: float = 0.2, max_output_tokens: int = 800):
    if not GEMINI_KEY:
        raise RuntimeError('GEMINI_API_KEY not set in environment')

    headers = {
        'Content-Type': 'application/json'
    }

    # Prefer using a service account to obtain an OAuth2 access token for Google Generative API.
    # Set SERVICE_ACCOUNT_FILE or GOOGLE_APPLICATION_CREDENTIALS env var to the JSON key path.
    service_account_file = os.getenv('SERVICE_ACCOUNT_FILE') or os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    use_api_key_in_url = False
    gemini_url = GEMINI_URL

    if service_account_file and GOOGLE_AUTH_AVAILABLE:
        creds = service_account.Credentials.from_service_account_file(service_account_file, scopes=["https://www.googleapis.com/auth/cloud-platform"])
        try:
            creds.refresh(GoogleRequest())
        except Exception as e:
            logging.exception('Could not refresh service account credentials')
            raise RuntimeError(f'Could not refresh service account credentials: {e}')
        token = creds.token
        if not token:
            raise RuntimeError('Failed to obtain access token from service account')
        headers['Authorization'] = f'Bearer {token}'
    else:
        # Fallback: if an API key is present, include it as a query param in the request URL.
        # Note: some Generative API endpoints require OAuth tokens and do not accept API keys.
        if GEMINI_KEY and GEMINI_KEY.startswith('AIza'):
            gemini_url = f"{GEMINI_URL}?key={GEMINI_KEY}"
            use_api_key_in_url = True
        else:
            # If google-auth is available but no service account was provided, and key is not API key,
            # attempt to use GEMINI_KEY as bearer token (if user provided a short-lived access token).
            headers['Authorization'] = f'Bearer {GEMINI_KEY}'

    # Construct request body for the Generative Language `generateMessage` endpoint
    body = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {"text": prompt}
            ]
        }
    ],
    "generationConfig": {
        "temperature": 0.2,
        "maxOutputTokens": 2048,
        "thinkingConfig": {
            "thinkingBudget": 0
        }
    }
}



    try:
        resp = requests.post(gemini_url, headers=headers, json=body, timeout=60)
    except requests.RequestException as re:
        logging.exception('Request to Gemini failed')
        raise RuntimeError(f'Network error when calling Gemini: {re}')
    if resp.status_code != 200:
        # include body for easier debugging
        logging.error('Gemini returned non-200: %s %s', resp.status_code, resp.text)
        raise RuntimeError(f'Gemini API error: {resp.status_code} {resp.text}')

    data = resp.json()

    # Try several common response shapes to extract text
    text = None
    if isinstance(data, dict):
        # Look for "candidates" array (common in some versions)
        if 'candidates' in data and isinstance(data['candidates'], list) and len(data['candidates']) > 0:
            first = data['candidates'][0]
            if isinstance(first, dict):
                # candidate may have nested content array
                content = first.get('content') or first.get('message') or first.get('output')
                if isinstance(content, list) and len(content) > 0 and isinstance(content[0], dict):
                    # content[0] may contain 'text' or 'output_text'
                    text = content[0].get('text') or content[0].get('output_text')
                elif isinstance(content, dict):
                    text = content.get('text') or content.get('output') or content.get('message')
                text = text or first.get('output') or first.get('text')
        # older/newer formats
        if not text:
            # try 'output' or similar
            if 'output' in data:
                text = data['output']
            elif 'result' in data and isinstance(data['result'], dict):
                text = data['result'].get('content') or data['result'].get('text')

    # final fallback: try to pull a top-level message text if present
    if not text:
        try:
            # some responses contain "candidates" -> [ { "content": [ { "text": "..." } ] } ]
            if isinstance(data.get('candidates'), list):
                cand = data['candidates'][0]
                if cand and isinstance(cand, dict):
                    cont = cand.get('content') or cand.get('message')
                    # Newer Gemini shape: content -> parts -> [{ text: "..." }]
                    if isinstance(cont, dict):
                        parts = cont.get('parts') or cont.get('content')
                        if isinstance(parts, list) and len(parts) > 0:
                            texts = []
                            for part in parts:
                                if isinstance(part, dict) and 'text' in part:
                                    texts.append(part.get('text'))
                                elif isinstance(part, str):
                                    texts.append(part)
                            if texts:
                                text = '\n'.join(t for t in texts if t)
                    # Older simple array shape
                    if not text and isinstance(cont, list) and len(cont) and isinstance(cont[0], dict):
                        text = cont[0].get('text')
        except Exception:
            pass

    # Fallback to returning the whole payload as string
    if not text:
        text = json.dumps(data)

    return text


@app.post('/review')
async def review_code(req: ReviewRequest):
    # base prompt
    prompt = (
        f"You are a senior software engineer and code reviewer.\n"
        f"Review the following code for the problem: {req.problemTitle}\n"
        f"Do the following:\n"
        f"1) Identify any bugs or incorrect logic and describe why they are wrong.\n"
        f"2) Provide a concise corrected version of the code (only the corrected function or file) with code fences.\n"
        f"3) Provide a short list of concrete steps to fix the code and tests to add.\n\n"
        f"Code:\n````\n{req.code}\n````\n"
    )

    # If an answers.txt exists in the backend folder, include it to tailor hints
    try:
        backend_dir = os.path.dirname(__file__)
        answers_path = os.path.join(backend_dir, 'answers.txt')
        if os.path.isfile(answers_path):
            try:
                with open(answers_path, 'r', encoding='utf-8') as af:
                    answers_text = af.read().strip()
                if answers_text:
                    prompt += (
                        "\n\nUser-provided answers (from answers.txt). Use these to tailor hints and corrections:\n"
                        f"````\n{answers_text}\n````\n"
                    )
                    logging.info('Included answers.txt in review prompt')
            except Exception:
                logging.exception('Could not read answers.txt')
    except Exception:
        # ignore filesystem errors
        pass

    try:
        reply = call_gemini(prompt, temperature=0.2, max_output_tokens=2048)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/chat')
async def chat_endpoint(req: ChatRequest):
    """Simple chat endpoint that forwards the user's message to Gemini and returns the assistant reply.

    It will include `answers.txt` contents when available to tailor responses.
    """
    user_msg = req.message or ""
    # Build prompt
    prompt = f"You are a helpful coding assistant. Reply helpfully and concisely to the user's message.\nUser: {user_msg}\n"

    # include answers file if exists
    try:
        backend_dir = os.path.dirname(__file__)
        answers_path = os.path.join(backend_dir, 'answers.txt')
        if os.path.isfile(answers_path):
            with open(answers_path, 'r', encoding='utf-8') as af:
                answers_text = af.read().strip()
            if answers_text:
                prompt += f"\nContext (answers.txt):\n````\n{answers_text}\n````\n"
    except Exception:
        logging.exception('Could not include answers.txt in chat prompt')

    try:
        reply = call_gemini(prompt, temperature=0.3, max_output_tokens=800)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/hint-file')
async def hint_from_file(file: UploadFile = File(...)):
    if file.content_type not in ("text/plain", "application/octet-stream"):
        raise HTTPException(status_code=400, detail='Only plain text files are accepted')

    contents = await file.read()
    try:
        text = contents.decode('utf-8')
    except Exception:
        text = contents.decode('latin-1')

    # Build prompt: user supplies answers to 5 questions in the text file
    prompt = (
        "You are a helpful coding mentor. The user uploaded a plain text file containing answers to 5 questions about their code/interview. "
        "Read the file content and provide hints and improvements based on the answers. Be concise and number the hints.\n\n"
        f"File contents:\n````\n{text}\n````\n"
    )

    try:
        reply = call_gemini(prompt, temperature=0.2, max_output_tokens=700)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/save-answers')
async def save_answers(payload: dict):
    """Save a plain text string of answers to a file on the backend.

    Expects JSON: { "answers": "..." }
    """
    answers = payload.get('answers') if isinstance(payload, dict) else None
    if not answers or not isinstance(answers, str):
        raise HTTPException(status_code=400, detail='No answers provided')

    try:
        backend_dir = os.path.dirname(__file__)
        path = os.path.join(backend_dir, 'answers.txt')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(answers)
        return {"status": "saved", "path": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
