import express from "express";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", enhanceJobDescription);
aiRouter.post("/upload-resume", uploadResume);

export default aiRouter;
