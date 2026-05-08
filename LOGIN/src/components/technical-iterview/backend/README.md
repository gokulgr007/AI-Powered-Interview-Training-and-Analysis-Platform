Technical Interview Backend (Gemini)

This small FastAPI service provides two endpoints to integrate Gemini-based code review and hinting into the frontend chat widget.

Environment
- Set `GEMINI_API_KEY` to a valid Google Generative API Bearer token.
- Optionally set `GEMINI_MODEL` (default: `chat-bison-001`).

Install
```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Run
```
uvicorn server:app --reload --port 8000
```

Endpoints
- POST /review
  - JSON body: { "code": "...", "problemTitle": "..." }
  - Returns: { "reply": "text from Gemini" }

- POST /hint-file
  - Form upload: file field containing a plain `.txt` file with answers to the 5 questions
  - Returns: { "reply": "text from Gemini" }

Notes
- This implementation uses a generic Gemini REST payload and attempts to extract the assistant text from common response shapes. Depending on the API version you must adapt `call_gemini` (request/response shape).
- Do not commit your `GEMINI_API_KEY` to source control.
