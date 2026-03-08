import express from 'express';
import multer from 'multer';
import path from 'path';
import { completeProfile, getProfile, updateProfile } from '../controllers/donor.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Multer config — saves uploaded ID proof to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `idproof-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    valid ? cb(null, true) : cb(new Error('Only jpg, png, pdf files allowed'));
  },
});

// All routes protected — user must be logged in
router.post('/complete', protect, upload.single('idProof'), completeProfile);
router.get('/', protect, getProfile);
router.put('/', protect, upload.single('idProof'), updateProfile);

export default router;