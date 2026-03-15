import express from 'express';
import { getPendingDonors, getPendingHospitals, verifyUser, rejectUser } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/pending-donors', protect, getPendingDonors);
router.get('/pending-hospitals', protect, getPendingHospitals);
router.patch('/verify/:id', protect, verifyUser);
router.delete('/reject/:id', protect, rejectUser);

export default router;