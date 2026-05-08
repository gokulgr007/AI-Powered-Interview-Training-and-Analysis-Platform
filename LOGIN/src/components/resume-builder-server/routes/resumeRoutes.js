import express from "express";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
  getAllResumes,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

// Authentication removed: resume endpoints are now public (app-level decision)
resumeRouter.post("/create", createResume);
resumeRouter.put("/update", upload.single("image"), updateResume);
resumeRouter.delete("/delete/:resumeId", deleteResume);
resumeRouter.get("/get/:resumeId", getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);
resumeRouter.get("/", getAllResumes);

export default resumeRouter;
