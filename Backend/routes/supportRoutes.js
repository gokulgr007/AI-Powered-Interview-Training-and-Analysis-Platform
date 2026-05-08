import express from 'express';
import multer from 'multer';
import { sendBugReport } from '../controllers/supportController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/support/bug
router.post('/bug', upload.single('screenshot'), sendBugReport);

export default router;
