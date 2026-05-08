from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from analyse_pdf import analyse_resume_gemini  # your existing function

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from React

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def extract_text_from_resume(pdf_path):
    """Extract text from PDF and truncate to avoid token overflow"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print("🔥 PDF extraction error:", e)
    return text[:15000]  # limit text


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    try:
        resume_file = request.files.get("resume")
        job_description = request.form.get("job_description")

        # Validate inputs
        if not resume_file:
            return jsonify({"error": "Resume file is required"}), 400
        if not resume_file.filename.endswith(".pdf"):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        if not job_description:
            return jsonify({"error": "Job description is required"}), 400

        # Save PDF
        filename = secure_filename(resume_file.filename)
        pdf_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        resume_file.save(pdf_path)

        # Extract text
        resume_text = extract_text_from_resume(pdf_path)

        # Analyze resume
        analysis = analyse_resume_gemini(resume_text, job_description)

        return jsonify({"analysis": analysis})

    except Exception as e:
        # Catch all errors and return JSON
        print("🔥 BACKEND ERROR:", e)
        return jsonify({"error": str(e)}), 500


# Optional: test endpoint to confirm server is running
@app.route("/ping", methods=["GET"])
def ping():
    return "API is running ✅"


if __name__ == "__main__":
    # Run on port 5001 to avoid collision with Node backend on 5000
    app.run(debug=True, port=5001)
