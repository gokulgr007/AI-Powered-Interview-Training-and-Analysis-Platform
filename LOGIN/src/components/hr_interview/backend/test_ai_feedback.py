import requests
import json

URL = 'http://127.0.0.1:5006/ai_feedback'

payload = {
    "expressions": {"happy": 0.6, "neutral": 0.3, "angry": 0.0},
    "transcript": "I led a backend API design project using Python, Docker and AWS. We improved performance by caching.",
    "language": "English"
}

r = requests.post(URL, json=payload, timeout=30)
print('status', r.status_code)
try:
    print(json.dumps(r.json(), indent=2))
except Exception:
    print(r.text)
