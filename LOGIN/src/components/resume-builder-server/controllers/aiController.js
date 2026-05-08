import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// helper: try SDK first, fall back to direct REST call when SDK returns 404
const callChatCompletion = async (payload) => {
  try {
    return await ai.chat.completions.create(payload);
  } catch (err) {
    // if the SDK can't reach the expected endpoint, try direct REST call
    if (err?.status === 404 || (err?.message && err.message.includes("404"))) {
      console.warn("SDK chat.completions.create returned 404 — falling back to REST API", err.message || err);

      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set for fallback REST call");

      const restBody = {
        model: payload.model || process.env.OPENAI_MODEL,
        messages: payload.messages,
      };

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(restBody),
      });

      if (!resp.ok) {
        const text = await resp.text();
        const e = new Error(`OpenAI REST call failed: ${resp.status} ${text}`);
        e.status = resp.status;
        throw e;
      }

      const json = await resp.json();
      return json;
    }

    throw err;
  }
};

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    console.log('enhanceProfessionalSummary incoming body:', req.body);
    const { userContent } = req.body;

    if (!userContent || typeof userContent !== "string" || userContent.trim() === "") {
      console.error("Bad Request: Missing or empty userContent", req.body);
      return res.status(400).json({ message: "Missing or empty professional summary." });
    }

    const response = await callChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    // response may come from SDK (with choices[].message.content) or REST (choices[].message.content)
    if (!response.choices || !response.choices[0]?.message?.content) {
      console.error("OpenAI response missing content:", response);
      return res.status(500).json({ message: "AI service error: No content returned." });
    }

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Error in enhanceProfessionalSummary:", error);
    return res.status(400).json({ message: error.message, details: error });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-pro-sum
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await callChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    if (!response.choices || !response.choices[0]?.message?.content) {
      console.error("OpenAI response missing content for job description:", response);
      return res.status(500).json({ message: "AI service error: No content returned." });
    }

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Error in enhanceJobDescription:", error);
    return res.status(400).json({ message: error.message, details: error });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI agent to extract date from resume.";

    const userPrompt = `extract data from this resume ${resumeText} Provide data in the following JSON format with no additional text before or after: 
      {
        professional_summary: { type: String, default: "" },
        skills: [{ type: String }],
        personal_info: {
          image: { type: String, default: "" },
          full_name: { type: String, default: "" },
          profession: { type: String, default: "" },
          email: { type: String, default: "" },
          phone: { type: String, default: "" },
          location: { type: String, default: "" },
          linkedin: { type: String, default: "" },
          github: { type: String, default: "" },
          website: { type: String, default: "" },
        },
        experience: [
          {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
          },
        ],
        project: [
          {
            name: { type: String },
            type: { type: String },
            description: { type: String },
          },
        ],
        experience: [
          {
            insitution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
          },
        ],
      }
    `;

    const response = await callChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    if (!response.choices || !response.choices[0]?.message?.content) {
      console.error("OpenAI response missing content for uploadResume:", response);
      return res.status(500).json({ message: "AI service error: No content returned." });
    }

    const extractedData = response.choices[0].message.content;

    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ title, ...parsedData });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
