import express from 'express';
import { getNotifications, createNotification, markAllRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.post('/mark-all-read', markAllRead);

export default router;
