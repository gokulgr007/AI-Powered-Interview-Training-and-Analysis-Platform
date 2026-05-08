import express from 'express';
import { createQuickScore, getLatestScore } from '../controllers/scoreController.js';
const router = express.Router();

router.post('/quick', createQuickScore);
router.get('/latest', getLatestScore);

export default router;
