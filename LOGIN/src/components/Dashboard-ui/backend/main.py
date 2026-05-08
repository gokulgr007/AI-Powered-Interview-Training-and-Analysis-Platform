import os
import requests
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# -----------------------------
# Models
# -----------------------------

class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# -----------------------------
# App setup
# -----------------------------

app = FastAPI(title="Mentor AI – Gemini Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Constants
# -----------------------------

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "models/gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1/{GEMINI_MODEL}:generateContent"

if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY is not set")

# -----------------------------
# Health check
# -----------------------------

@app.get("/api/gemini/health")
def health():
    return {"status": "ok"}

# -----------------------------
# Chat endpoint
# -----------------------------

@app.post("/api/gemini/chat")
async def gemini_chat(body: ChatRequest):
    if not body.messages:
        raise HTTPException(status_code=400, detail="Messages array is empty")

    # ---- Optional system prompt (server-side control) ----
    system_prompt = """
You are Mentor AI, an expert Interview Mentor and Mock Interviewer.

ROLE:
- You ONLY help with interview preparation.
- You behave like a real interviewer and career coach.
- You ask interview questions, evaluate answers, and give feedback.
- You help with HR, Behavioral, Technical, and System Design interviews.

RULES:
- Do NOT answer unrelated general questions.
- Do NOT behave like a casual chatbot.
- Keep responses professional, structured, and interview-focused.
- If the user asks something unclear, ask a clarifying interview-style question.
- When appropriate, ask follow-up interview questions.

BEHAVIOR:
- If the user asks for practice → start a mock interview.
- If the user asks a doubt → explain with interview examples.
- If the answer is weak → explain why and how to improve.
- Always think like an interviewer.

FORMAT:
- Use bullet points where helpful.
- Clearly label sections: Question, Feedback, Improvement, Score (if applicable).
"""


    contents = [
        {
            "role": "user",
            "parts": [{"text": system_prompt}]
        }
    ]

    # ---- Convert frontend messages → Gemini format ----
    for m in body.messages:
        contents.append({
            "role": "user" if m.role == "user" else "model",
            "parts": [{"text": m.content}]
        })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.9,
            "maxOutputTokens": 1024
        }
    }

    try:
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=30
        )
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Network error: {e}")

    if not response.ok:
        raise HTTPException(
            status_code=502,
            detail=response.text
        )

    data = response.json()

    # ---- Extract AI reply safely ----
    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        reply = "Sorry, I couldn't generate a response."

    return {
        "reply": reply
    }

# -----------------------------
# Run locally
# -----------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=True
    )
