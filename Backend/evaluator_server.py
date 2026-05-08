from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvaluatePayload(BaseModel):
    user: dict = None
    rounds: list = None
    completedRounds: list = None
    activeRound: int = 0
    timer: int = 0
    notes: str = ''


def call_gemini(prompt: str):
    """Call Gemini-like API. Behavior:
    - If both GEMINI_API_URL and GEMINI_API_KEY are set, POST JSON {"prompt": prompt}
      with `Authorization: Bearer <key>` header to the URL.
    - Otherwise, return a mocked evaluation.
    """
    api_key = os.getenv('GEMINI_API_KEY')
    api_url = os.getenv('GEMINI_API_URL')
    model = os.getenv('GEMINI_MODEL')  # e.g. models/gemini-2.5-flash

    # If a GEMINI_MODEL is provided, construct the Google Generative Language URL
    if model:
        api_url = f"https://generativelanguage.googleapis.com/v1/{model}:generateContent"

    if api_key and api_url:
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            # If calling Google Generative Language, send model + input structure
            if api_url and 'generativelanguage.googleapis.com' in api_url and model:
                payload = { 'model': model, 'input': { 'text': prompt } }
            else:
                payload = { 'prompt': prompt }
            r = requests.post(api_url, headers=headers, json=payload, timeout=30)
            r.raise_for_status()
            try:
                return r.json()
            except Exception:
                return { 'text': r.text }
        except Exception as e:
            return { 'error': str(e) }

    # Fallback mock evaluation when no API configured
    # The response shape mimics what the frontend expects below
    overall = 0.78
    confidence = 0.85
    strengths = ["Clear structure in answers", "Good time management", "Handled edge-cases"]
    improvements = ["Provide more algorithmic trade-offs", "Explain complexity more precisely", "Practice coding speed"]
    details = {
        'overall': overall,
        'confidence': confidence,
        'verdict': 'Promising',
        'strengths_html': '<ul>' + ''.join(f'<li>{s}</li>' for s in strengths) + '</ul>',
        'improvements_html': '<ul>' + ''.join(f'<li>{s}</li>' for s in improvements) + '</ul>'
    }
    return { 'mock': True, 'evaluation': details }


@app.post('/evaluate-report')
async def evaluate_report(payload: EvaluatePayload):
    # Build a compact prompt for the LLM summarizer/evaluator
    prompt_lines = []
    if payload.user:
        prompt_lines.append(f"User: {payload.user.get('name','<anon>')} ({payload.user.get('email','')})")
    prompt_lines.append(f"Active round: {payload.activeRound}")
    prompt_lines.append(f"Completed rounds: {payload.completedRounds}")
    if payload.rounds:
        for r in payload.rounds:
            prompt_lines.append(f"Round {r.get('id')}: {r.get('name')} - {r.get('type')} ({r.get('duration')})")
    if payload.notes:
        prompt_lines.append('\nNotes:\n' + payload.notes)

    prompt = "\n".join(prompt_lines)
    prompt = (
        "You are an interview evaluator. Given the interview meta-data below, produce:\n"
        "1) An overall score between 0 and 1.\n"
        "2) A confidence score between 0 and 1.\n"
        "3) A short verdict label.\n"
        "4) A small list of strengths (3 max).\n"
        "5) A small list of improvements/failures (3 max).\n"
        "Return JSON with keys: overall, confidence, verdict, strengths_html, improvements_html.\n\n"
    ) + "Interview data:\n" + prompt

    # Call Gemini (or mock)
    resp = call_gemini(prompt)

    # If call_gemini returned a direct JSON with the expected fields, try to normalize
    if isinstance(resp, dict):
        if resp.get('evaluation'):
            return resp['evaluation']
        if resp.get('text'):
            # best-effort: try to extract JSON from text
            try:
                parsed = json.loads(resp['text'])
                return parsed
            except Exception:
                pass
        # if the remote LLM returned a dict, try to map fields
        for k in ('overall','confidence','verdict','strengths_html','improvements_html'):
            if k in resp:
                return resp

    # final fallback: return the mock evaluation structure if nothing usable
    return {
        'overall': 0.6,
        'confidence': 0.5,
        'verdict': 'Needs Improvement',
        'strengths_html': '<ul><li>Communication</li></ul>',
        'improvements_html': '<ul><li>Problem solving speed</li></ul>'
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('Backend.evaluator_server:app', host='127.0.0.1', port=8000, reload=False)
