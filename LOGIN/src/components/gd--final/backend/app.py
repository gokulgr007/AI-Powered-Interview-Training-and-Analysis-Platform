import threading
import time
import os
import random
import queue
import asyncio
import pygame
import edge_tts
from flask import Flask, jsonify, request
from flask_cors import CORS
import speech_recognition as sr
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
import traceback
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
load_dotenv()

# Load Gemini API key from environment (.env or system env). Set GEMINI_API_KEY.
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("CRITICAL: Gemini API Key is missing. Please set GEMINI_API_KEY in your environment or .env")
else:
    try:
        genai.configure(api_key=api_key)
        print(f"[config] SUCCESS: Gemini configured with key ending in ...{api_key[-4:]}")
    except Exception as e:
        print(f"[config] Error configuring Gemini: {e}")

# --- GLOBAL VARIABLES ---
ui_events = queue.Queue()
stop_flag = False
conclude_flag = False

# Initialize Global Recognizer
recognizer = sr.Recognizer()
recognizer.dynamic_energy_threshold = True
recognizer.energy_threshold = 300
recognizer.pause_threshold = 1.2
mic = sr.Microphone()

conversation_context = {}
user_transcript_log = []

# --- DATA ---
TOPICS = [
    "Artificial Intelligence in Healthcare", "Impact of Social Media on Youth",
    "Remote Work vs Office Culture", "Is Technology Making Us Lazy?",
    "Data Privacy: Myth or Reality?", "Future of Online Education",
    "Video Games: Hobby or Addiction?", "Will AI Replace Creatives?",
    "Should Students Use ChatGPT for Homework?", "Universal Basic Income",
    "The 4-Day Work Week: Good or Bad?", "Should Mobile Phones Be Banned in Schools?", 
    "Is Space Tourism a Waste of Money?", "Paper Books vs E-Books", "Are Influencers Good Role Models?"
]

user_stats = { "turns": 0, "spoken_turns": 0, "total_words": 0, "silence_count": 0, "relevant_responses": 0, "conclusion_given": False }

BOTS = [
    {"name": "Alex", "voice": "en-US-ChristopherNeural", "role": "Teacher", "prompt_style": "You are Alex, a teacher. Calm and thoughtful."},
    {"name": "Lisa", "voice": "en-US-AriaNeural", "role": "Tech Expert", "prompt_style": "You are Lisa, a tech geek. Sharp, fast, logical."},
    {"name": "John", "voice": "en-GB-RyanNeural", "role": "Analyst", "prompt_style": "You are John, a data analyst. Skeptical, factual, British."},
    {"name": "Emma", "voice": "en-US-JennyNeural", "role": "Futurist", "prompt_style": "You are Emma, an optimist. Excited about the future."},
]
ALL_PARTICIPANTS = ["YOU"] + [b["name"] for b in BOTS]

def push_event(event_type, speaker=None, text=None, extra=None):
    ui_events.put({
        "type": event_type, 
        "speaker": speaker, 
        "text": text,
        "extra": extra
    })

def check_for_mentions(text):
    text_lower = text.lower()
    for bot in BOTS:
        if bot["name"].lower() in text_lower:
            print(f"Priority: User asked for {bot['name']}")
            return bot["name"]
    return None

# --- AUDIO & MIC ---
def play_edge_tts(text, voice):
    output_file = "temp_audio.mp3"
    async def _gen():
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)
    asyncio.run(_gen())
    
    try:
        if not pygame.mixer.get_init():
            pygame.mixer.init()
            
        pygame.mixer.music.load(output_file)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            if stop_flag:
                pygame.mixer.music.stop()
                break
            time.sleep(0.1)
        pygame.mixer.music.unload()
    except Exception as e:
        print(f"Audio Error: {e}")

def speak(name, text, voice):
    global stop_flag
    if stop_flag: return
    conversation_context["last_speaker"] = name
    conversation_context["last_text"] = text
    push_event("speak_start", speaker=name, text=text)
    
    if not pygame.mixer.get_init():
        pygame.mixer.init()
        
    play_edge_tts(text, voice)
    push_event("speak_end", speaker=name)

def listen_from_mic(timeout=None):
    global stop_flag
    if stop_flag: return None

    if pygame.mixer.get_init():
        pygame.mixer.quit()

    push_event("mic_start", speaker="YOU")
    print("You may start speaking...")
    
    text_result = None

    try:
        with mic as source:
                try:
                    audio = recognizer.listen(source, timeout=5, phrase_time_limit=15)
                    push_event("mic_processing", speaker="YOU")
                    text_result = recognizer.recognize_google(audio, language="en-IN")
                    print(f"YOU SAID: {text_result}")
                except sr.WaitTimeoutError:
                    print("Silence (Timeout)")
                    push_event("mic_end", speaker="YOU")
                except sr.UnknownValueError:
                    print("Could not understand audio")
                except Exception as e:
                    print(f"Audio Error: {e}")
    finally:
        pygame.mixer.init()

    if text_result:
        push_event("mic_end", speaker="YOU")
        user_transcript_log.append(text_result)
        conversation_context["last_speaker"] = "YOU"
        conversation_context["last_text"] = text_result
        mentioned = check_for_mentions(text_result)
        if mentioned: conversation_context["next_speaker_override"] = mentioned
        return text_result
    
    push_event("mic_end", speaker="YOU")
    return None

# --- GEMINI AI LOGIC ---
def generate_ai_text(bot_data, topic, limit_words=40):
    last_speaker = conversation_context.get("last_speaker", "System")
    last_text = conversation_context.get("last_text", "")
    
    # Construct prompt for Gemini
    system_instruction = f"{bot_data['prompt_style']} Topic: '{topic}'. Rules: Short ({limit_words} words). Natural. Respond to {last_speaker}. NO EMOJIS."
    user_prompt = f"Previous speaker {last_speaker} said: \"{last_text}\". What is your reaction?"

    try:
        # Initialize Gemini Model
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instruction
        )
        
        response = model.generate_content(user_prompt)
        return response.text
    except Exception as e:
        print(f"[Gemini] Error generating text: {e}")
        traceback.print_exc()
        return "I have a thought on that, but I need a moment."

def generate_final_evaluation(topic):
    full_transcript = " ".join(user_transcript_log)
    if not full_transcript: return "<div class='error-msg'>No speech detected from user.</div>"
    
    system_instruction = "You are a strict Senior HR Recruiter. Generate ONLY valid HTML code inside a single <div>."
    
    prompt = (
        f"Topic: '{topic}'. Transcript: \"{full_transcript}\". "
        "Generate a premium HTML Performance Report. "
        "Follow these rules for ACCURACY: "
        "1. Reference specific arguments the candidate made."
        "2. Be critical. Do not give generic praise."
        "3. Provide an 'Overall Score' out of 100 based on Logic, Fluency, and Listening."
        
        "Use these EXACT HTML classes:"
        "1. <div class='report-header'>: Contains <h2>Candidate Report</h2>, <p class='topic-badge'>{topic}</p>, "
        "   and a large <div class='overall-score'><span>Overall Score</span><strong>X/100</strong></div>."
        
        "2. <div class='score-grid'>: 3 cards <div class='metric-card'> for 'Communication', 'Leadership', 'Critical Thinking'. "
        "   Inside each: <h4>Title</h4>, <div class='progress-bar'><div style='width: X%'></div></div>."
        
        "3. <div class='feedback-container'>: "
        "   <div class='feedback-item positive'><h3>✅ Strengths</h3><ul>...</ul></div>"
        "   <div class='feedback-item negative'><h3>⚠️ Improvements</h3><ul>...</ul></div>"
        
        "4. <div class='verdict-box'> Verdict: [HIRE / STRONG CANDIDATE / REJECT] </div>"
    )
    
    try:
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instruction
        )
        response = model.generate_content(prompt)
        # Clean response if Gemini adds markdown code blocks
        clean_html = response.text.replace("```html", "").replace("```", "")
        return clean_html
    except Exception as e:
        print(f"[Gemini] Error generating report: {e}")
        return f"<p>Error generating report: {e}</p>"

# --- MAIN LOOP ---
def run_simulation_logic():
    global stop_flag, conclude_flag, user_stats, conversation_context, user_transcript_log
    
    current_topic = random.choice(TOPICS)
    conversation_context = {"last_speaker": "System", "last_text": f"The topic is {current_topic}.", "next_speaker_override": None}
    
    if stop_flag: return
    
    print("Calibrating background noise...")
    if pygame.mixer.get_init(): pygame.mixer.quit()
    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=2.0)
    pygame.mixer.init()
    
    push_event("init", extra={"topic": current_topic})
    time.sleep(1)

    max_rounds = 4 
    for r in range(1, max_rounds + 1):
        if stop_flag or conclude_flag: break 
        
        round_queue = ALL_PARTICIPANTS.copy()
        random.shuffle(round_queue)
        
        while round_queue or conversation_context["next_speaker_override"]:
            if stop_flag or conclude_flag: break 
            
            next_speaker = None
            override_candidate = conversation_context["next_speaker_override"]
            
            if override_candidate:
                next_speaker = override_candidate
                conversation_context["next_speaker_override"] = None 
                if next_speaker in round_queue: round_queue.remove(next_speaker)
            elif round_queue: 
                next_speaker = round_queue.pop(0)
            else: 
                break

            if next_speaker == "YOU":
                text = listen_from_mic()
                if text: 
                    push_event("human_speech", speaker="YOU", text=text)
                    user_stats["spoken_turns"] += 1
                else: 
                    conversation_context["last_speaker"] = "YOU"
                    conversation_context["last_text"] = "..."
            else:
                bot = next(b for b in BOTS if b["name"] == next_speaker)
                text = generate_ai_text(bot, current_topic, random.randint(30, 50)) 
                speak(bot["name"], text, bot["voice"])
            time.sleep(0.5)

        if r == 1 and not stop_flag and not conclude_flag:
            push_event("enable_conclude")

    # --- CONCLUSION PHASE ---
    if not stop_flag:
        push_event("human_speech", speaker="System", text="Discussion ending. Please provide your conclusion.")
        speak("System", "We are stopping here. Please give your final conclusion.", "en-US-AriaNeural")
        
        text = listen_from_mic(timeout=15)
        if text: 
            push_event("human_speech", speaker="YOU (Conclusion)", text=text)
            user_transcript_log.append(f"Conclusion: {text}")

        push_event("human_speech", speaker="System", text="Generating Performance Report...")
        eval_html = generate_final_evaluation(current_topic)
        push_event("evaluation", extra={"html_content": eval_html})
    
    push_event("finished")

# --- ROUTES ---
@app.route('/start', methods=['POST'])
def start_simulation():
    global stop_flag, conclude_flag, conversation_context, user_transcript_log
    
    stop_flag = True
    conclude_flag = False
    
    if pygame.mixer.get_init():
        pygame.mixer.music.stop()
    
    with ui_events.mutex:
        ui_events.queue.clear()

    user_transcript_log = []
    conversation_context = {"last_speaker": "System", "last_text": "", "next_speaker_override": None}
    
    time.sleep(0.5)
    
    stop_flag = False
    thread = threading.Thread(target=run_simulation_logic)
    thread.daemon = True
    thread.start()
    
    return jsonify({"status": "started"})

@app.route('/conclude', methods=['POST'])
def conclude_simulation():
    global conclude_flag
    conclude_flag = True
    return jsonify({"status": "concluding"})

@app.route('/stop', methods=['POST'])
def stop_simulation():
    global stop_flag
    stop_flag = True
    if pygame.mixer.get_init(): pygame.mixer.music.stop()
    with ui_events.mutex: ui_events.queue.clear()
    push_event("finished")
    return jsonify({"status": "stopped"})

@app.route('/get_updates')
def get_updates():
    events = []
    try:
        while not ui_events.empty(): events.append(ui_events.get_nowait())
    except queue.Empty: pass
    return jsonify(events)

if __name__ == '__main__':
    pygame.mixer.init()
    # Running on port 5010
    app.run(debug=True, port=5010)