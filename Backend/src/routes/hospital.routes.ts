import express from 'express';
import { completeProfile, getProfile, updateProfile } from '../controllers/hospital.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/complete', protect, completeProfile);
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;