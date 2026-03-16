import express from 'express';
import { completeProfile, getProfile, updateProfile } from '../controllers/donor.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.post('/complete', protect, upload.single('idProof'), completeProfile);
router.get('/',          protect, getProfile);
router.put('/',          protect, upload.single('idProof'), updateProfile);

export default router;