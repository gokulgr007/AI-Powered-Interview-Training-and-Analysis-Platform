import express from 'express';
import protect from '../middlewares/auth.js';
import { getScores, updateScores, updateProfile, updatePassword, deleteAccount } from '../controllers/userController.js';

const router = express.Router();

router.get('/scores', protect, getScores);
router.put('/scores', protect, updateScores);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/delete', protect, deleteAccount);

export default router;