import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai
import os
from dotenv import load_dotenv, find_dotenv

# Load the nearest .env file (component folder or project root)
load_dotenv(find_dotenv())

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 0.6,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 3000,
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config
)


def analyse_resume_gemini(resume_content, job_description):
    prompt = f"""
You are an advanced ATS (Applicant Tracking System) resume analyzer used by top recruiters.

Analyze the resume strictly against the job description.

Resume:
{resume_content}

Job Description:
{job_description}

Perform the following analysis:

1. ATS Match Score (0–100)
2. Skill Match Percentage
3. Missing Technical Skills
4. Missing Soft Skills
5. Keyword Coverage (important JD keywords missing from resume)
6. Experience Level Fit (Junior / Mid / Senior + reasoning)
7. Resume Strengths
8. Section-wise Feedback:
   - Summary
   - Skills
   - Experience
   - Projects
   - Education
9. Improvement Suggestions (Actionable)
10. Final Hiring Recommendation (Strong Yes / Maybe / No)

Return the result strictly in this format:

ATS Match Score: XX/100
Skill Match: XX%

Missing Technical Skills:
- ...

Missing Soft Skills:
- ...

Missing Keywords:
- ...

Experience Level Fit:
(Level + short explanation)

Resume Strengths:
- ...

Section-wise Feedback:
Summary:
...
Skills:
...
Experience:
...
Projects:
...
Education:
...

Improvement Suggestions:
- ...

Final Hiring Recommendation:
(Strong Yes / Maybe / No + 1 line justification)
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error analyzing resume: {str(e)}"