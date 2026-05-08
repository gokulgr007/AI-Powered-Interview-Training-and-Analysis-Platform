import threading
import time
import os
import random
import queue
import asyncio
import pygame
import edge_tts
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
import speech_recognition as sr
import google.generativeai as genai 
import tempfile
import uuid
import json
import sys
import io

# Ensure console encoding supports UTF-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        os.environ.setdefault('PYTHONIOENCODING', 'utf-8')

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
# Replace with your actual Gemini API Key or use os.getenv("GEMINI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or "GEMINI_API_KEY_NOT_SET"

try:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using 'gemini-1.5-flash' for speed and cost-efficiency
    model = genai.GenerativeModel('gemini-2.5-flash')
    print("[Config] Gemini API configured successfully.")
except Exception as e:
    print(f"[Config] Error configuring Gemini: {e}")

ui_events = queue.Queue()
stop_flag = False
pygame.mixer.init()

# --- SETTINGS ---
INTERVIEW_DURATION = 300 
STOP_PHRASES = ["can we stop", "stop the interview", "end interview", "finish interview", "stop now"]
conversation_context = { "last_speaker": "System", "last_text": "" }
user_transcript_log = []

# --- DATA ---
HR_BOT = {
    "name": "Sarah", 
    "voice": "en-US-AvaNeural", 
    "role": "Interviewer", 
    "prompt_style": "You are a professional HR interviewer. Polite, observant, and engaging."
}

# --- HELPER FUNCTIONS ---
def push_event(event_type, speaker=None, text=None, extra=None):
    ui_events.put({"type": event_type, "speaker": speaker, "text": text, "extra": extra})

def clean_text(text):
    if not text: return ""
    # Remove simple markdown formatting like **bold**
    text = re.sub(r'\*+', '', text)
    return text.strip()

def play_edge_tts(text, voice, ignore_stop=False):
    if pygame.mixer.music.get_busy():
        try: pygame.mixer.music.stop()
        except Exception: pass

    temp_dir = tempfile.gettempdir()
    filename = f"hr_tts_{uuid.uuid4().hex}.mp3"
    output_file = os.path.join(temp_dir, filename)

    async def _gen():
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)

    try:
        asyncio.run(_gen())
    except Exception as e:
        print(f"TTS generation error: {e}")
        return

    try:
        if not os.path.exists(output_file): return

        pygame.mixer.music.load(output_file)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            if stop_flag and not ignore_stop:
                try: pygame.mixer.music.stop()
                except Exception: pass
                break
            time.sleep(0.1)
        try: pygame.mixer.music.unload()
        except Exception: pass
    except Exception as e:
        print(f"Audio Error: {e}")
    finally:
        try:
            if os.path.exists(output_file): os.remove(output_file)
        except Exception: pass

def speak(name, text, voice, ignore_stop=False):
    global stop_flag
    if stop_flag and not ignore_stop: return
    clean_txt = clean_text(text)
    conversation_context["last_speaker"] = name
    conversation_context["last_text"] = clean_txt
    push_event("speak_start", speaker=name, text=clean_txt)
    play_edge_tts(clean_txt, voice, ignore_stop)
    push_event("speak_end", speaker=name)

# --- RECOGNITION ---
def check_for_stop(text):
    if not text: return False
    text_lower = text.lower()
    for phrase in STOP_PHRASES:
        if phrase in text_lower: return True
    return False

def listen_from_mic():
    global stop_flag
    if stop_flag: return None
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    recognizer.dynamic_energy_threshold = False 
    recognizer.energy_threshold = 300           
    recognizer.pause_threshold = 2.0            
    recognizer.non_speaking_duration = 0.5

    push_event("mic_start", speaker="YOU")
    print("🟢 Listening...")
    with mic as source:
        try:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.listen(source, timeout=15, phrase_time_limit=None)
        except sr.WaitTimeoutError:
            push_event("mic_end", speaker="YOU")
            return None

    push_event("mic_processing", speaker="YOU")
    try:
        text = recognizer.recognize_google(audio, language="en-US")
        print(f"✅ YOU: {text}")
        push_event("mic_end", speaker="YOU")
        user_transcript_log.append(f"Candidate: {text}")
        return text
    except:
        push_event("mic_end", speaker="YOU")
        return None

# --- GEMINI AI FUNCTIONS ---
def generate_hr_question():
    system_instruction = f"{HR_BOT['prompt_style']} Rules: 1. Acknowledge user. 2. Ask relevant follow-up. 3. Keep it under 30 words."
    context_snippet = "\n".join(user_transcript_log[-3:])
    
    # Gemini doesn't use a 'messages' array in the same way for single turn generation
    prompt = f"System Instruction: {system_instruction}\n\nRecent Transcript:\n{context_snippet}\n\nTask: Candidate just finished speaking. Respond naturally as the HR interviewer."
    
    try:
        response = model.generate_content(prompt)
        return clean_text(response.text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "I see. Let's move on."

def generate_verbal_feedback():
    full_transcript = " ".join(user_transcript_log)
    prompt = (
        f"Review transcript: '{full_transcript}'. "
        "You are the HR manager. In 3 sentences, gently tell the candidate what to improve. "
        "Start with 'Thank you for your time. Here is some quick feedback...'"
    )
    try:
        response = model.generate_content(prompt)
        return clean_text(response.text)
    except Exception as e:
        print(f"Gemini Feedback Error: {e}")
        return "Thank you. Your feedback report is ready below."

def generate_final_evaluation(expressions_list):
    full_transcript = " ".join(user_transcript_log)
    if not full_transcript: return "<p>No speech detected.</p>"
    
    if expressions_list:
        counts = {x: expressions_list.count(x) for x in expressions_list}
        dominant_emotion = max(counts, key=counts.get)
        expression_summary = f"Detected Expressions: {counts}. Dominant Emotion: {dominant_emotion}."
    else:
        expression_summary = "No facial data available."

    prompt = (
        f"Act as a Senior HR Recruiter. Review this interview.\n"
        f"Transcript: '{full_transcript}'\n"
        f"Facial Analysis Data: '{expression_summary}'\n\n"
        
        "Generate a strictly HTML 'Candidate Evaluation Report' (single <div>). NO Markdown blocks (like ```html). "
        "Use this EXACT structure:\n"
        
        "1. <div class='overall-score-box'>"
        "   <span class='big-score'>[Score]/100</span>"
        "   <span class='label'>Overall Match Score</span>"
        "</div>"
        
        "2. <h3>Executive Summary</h3> (2 professional sentences)"
        
        "3. <div class='metrics-grid'>"
        "   <div class='metric-item'><strong>Confidence</strong><br><span class='score'>[Rating]/10</span></div>"
        "   <div class='metric-item'><strong>Communication</strong><br><span class='score'>[Rating]/10</span></div>"
        "   <div class='metric-item'><strong>Technical/Content</strong><br><span class='score'>[Rating]/10</span></div>"
        "</div>"
        
        "4. <h3>Behavioral & Facial Analysis</h3>"
        "<ul>"
        "<li><strong>Facial Expressions:</strong> [Analyze based on the Facial Analysis Data provided. Was he nervous/happy?]</li>"
        "<li><strong>Body Language cues:</strong> [Infer from speech patterns and pauses]</li>"
        "</ul>"
        
        "5. <h3>Key Improvements</h3>"
        "<ul>"
        "<li>[Specific improvement 1]</li>"
        "<li>[Specific improvement 2]</li>"
        "</ul>"
        
        "6. <div class='verdict-box'><strong>Final Verdict:</strong> [Hire / Weak Hire / Reject]</div>"
    )
    
    try:
        response = model.generate_content(prompt)
        # Clean markdown wrappers if Gemini adds them
        html = response.text.replace("```html", "").replace("```", "").strip()
        return html
    except Exception as e:
        return f"<p>Error generating report: {e}</p>"

def run_simulation_logic():
    global stop_flag, user_transcript_log
    stop_flag = False
    user_transcript_log = [] 
    
    push_event("init", extra={"topic": "Live Interview"})
    time.sleep(2) 

    intro_text = "Hello. Let's begin. Please tell me a little about yourself."
    user_transcript_log.append(f"HR: {intro_text}")
    speak(HR_BOT["name"], intro_text, HR_BOT["voice"])
    
    start_time = time.time()
    
    while (time.time() - start_time) < INTERVIEW_DURATION:
        if stop_flag: break
        time.sleep(0.3) 
        user_text = listen_from_mic()
        if stop_flag: break

        if user_text: 
            push_event("human_speech", speaker="YOU", text=user_text)
            if check_for_stop(user_text):
                speak(HR_BOT["name"], "Ending interview.", HR_BOT["voice"])
                break
            hr_response = generate_hr_question()
            user_transcript_log.append(f"HR: {hr_response}")
            speak(HR_BOT["name"], hr_response, HR_BOT["voice"])
    
    if not stop_flag:
        push_event("finished")

# --- ROUTES ---
@app.route('/start', methods=['POST'])
def start_simulation():
    global stop_flag
    stop_flag = False
    thread = threading.Thread(target=run_simulation_logic)
    thread.daemon = True
    thread.start()
    return jsonify({"status": "started"})

@app.route('/stop', methods=['POST'])
def stop_simulation():
    global stop_flag
    stop_flag = True
    if pygame.mixer.get_init(): pygame.mixer.music.stop()
    with ui_events.mutex: ui_events.queue.clear()
    push_event("finished")
    return jsonify({"status": "stopped"})

@app.route('/report', methods=['POST'])
def generate_report():
    try: data = request.get_json() or {}
    except: data = {}
    expressions = data.get('expressions', [])

    try:
        eval_html = generate_final_evaluation(expressions)
    except Exception as e:
        eval_html = f"<p>Error generating evaluation: {e}</p>"

    push_event("evaluation", extra={"html_content": eval_html})
    return jsonify({"status": "report_generated", "html_content": eval_html})

@app.route('/ai_feedback', methods=['POST'])
def ai_feedback():
    """Gemini-powered feedback generation expecting JSON output"""
    try: data = request.get_json() or {}
    except: data = {}

    expressions = data.get('expressions', {})
    transcript = data.get('transcript', '')
    language = data.get('language', None) or 'English'

    # --- Pre-calculate metrics (same logic as before) ---
    try:
        if isinstance(expressions, dict):
            happy = float(expressions.get('happy', 0) or 0)
            neutral = float(expressions.get('neutral', 0) or 0)
            nervous = float(expressions.get('nervous', 0) or 0)
            conf_score = max(0.0, min(1.0, (happy * 0.8 + neutral * 0.6) - (nervous * 0.6) + 0.2))
        else: conf_score = 0.0
    except: conf_score = 0.0

    # Basic text stats
    try:
        txt = (transcript or '').lower()
        words = re.findall(r"\w+", txt)
        word_count = len(words)
        filler_words = len(re.findall(r"\b(um|uh|like|so|basically)\b", txt))
        comm_base = min(1.0, word_count / 40.0)
        communication_score = max(0.0, comm_base - (filler_words * 0.08))
    except: communication_score = 0.0

    # Technical keywords
    try:
        keywords = ['python','react','node','sql','api','aws','cloud','testing']
        matches = sum(1 for k in keywords if k in (transcript or '').lower())
        technical_score = min(1.0, matches / 3.0)
    except: technical_score = 0.0

    overall_score = int(round((conf_score * 0.35 + communication_score * 0.45 + technical_score * 0.20) * 100))

    # --- Construct Gemini Prompt ---
    context = {
        "transcript": transcript,
        "facial_expressions": expressions,
        "computed_metrics": {
            "confidence": round(conf_score, 3),
            "communication": round(communication_score, 3),
            "technical": round(technical_score, 3),
            "overall": overall_score
        }
    }

    prompt = (
        f"You are an expert HR evaluator. Respond in {language}. "
        f"Return ONLY a valid JSON object (no markdown, no backticks). "
        f"JSON keys required: 'overall_score' (int), 'metrics' (object with confidence, communication, technical), "
        f"and 'html_content' (string containing the HTML report).\n\n"
        f"Context Data:\n{json.dumps(context)}"
    )

    try:
        # Request JSON mode via prompt + model config (optional, but prompt is usually enough)
        response = model.generate_content(prompt)
        raw_text = response.text
        
        # Clean up potential markdown formatting (```json ... ```)
        if "```" in raw_text:
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        
        parsed = json.loads(raw_text)
        
        # Ensure fallback logic if parsing succeeds but data is partial
        final_overall = parsed.get('overall_score', overall_score)
        
        return jsonify(parsed)

    except Exception as e:
        print(f"Gemini AI Feedback Error: {e}")
        # Fallback if Gemini fails or returns invalid JSON
        fallback_html = f"<div class='overall-score-box'><span class='big-score'>{overall_score}/100</span></div><p>Automated summary unavailable.</p>"
        fallback_result = {
            "html_content": fallback_html,
            "overall_score": overall_score,
            "metrics": {
                "confidence": round(conf_score, 3),
                "communication": round(communication_score, 3),
                "technical": round(technical_score, 3)
            }
        }
        return jsonify(fallback_result)

@app.route('/feedback', methods=['POST'])
def trigger_feedback():
    global stop_flag
    data = request.json
    expressions = data.get('expressions', [])
    stop_flag = True 
    
    def feedback_sequence():
        time.sleep(1) 
        verbal_feedback = generate_verbal_feedback()
        speak(HR_BOT["name"], verbal_feedback, HR_BOT["voice"], ignore_stop=True)
        eval_html = generate_final_evaluation(expressions)
        push_event("evaluation", extra={"html_content": eval_html})
        push_event("finished")

    thread = threading.Thread(target=feedback_sequence)
    thread.start()
    return jsonify({"status": "feedback_started"})

@app.route('/get_updates')
def get_updates():
    events = []
    try:
        while not ui_events.empty(): events.append(ui_events.get_nowait())
    except queue.Empty: pass
    return jsonify(events)

if __name__ == '__main__':
    print("--- HR BOT READY (Gemini Powered) ---")
    app.run(debug=True, port=5006)