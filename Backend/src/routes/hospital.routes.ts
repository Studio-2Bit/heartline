import express from 'express';
import { completeProfile, getProfile, updateProfile } from '../controllers/hospital.controller';
import { protect } from '../middlewares/auth.middleware';

console.log('hospital routes loaded');

const router = express.Router();

router.post('/complete', (req, res, next) => {
  console.log('HIT /complete route');
  next();
}, protect, completeProfile);
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;