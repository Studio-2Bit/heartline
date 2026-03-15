import express from 'express';
import { getNotifications, markAllRead, markOneRead } from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/',           protect, getNotifications);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markOneRead);

export default router;