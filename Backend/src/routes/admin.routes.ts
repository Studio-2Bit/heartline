import express from 'express';
import { getPendingDonors, getPendingHospitals, verifyUser, rejectUser, getAllDonors, getAllHospitals,deleteUser,getDashboardStats,getSystemLogs,verifyAdminPassword,addAdmin } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/pending-donors', protect, getPendingDonors);
router.get('/pending-hospitals', protect, getPendingHospitals);
router.patch('/verify/:id', protect, verifyUser);
router.delete('/reject/:id', protect, rejectUser);
router.get('/all-donors', protect,  getAllDonors);
router.get('/all-hospitals', protect,  getAllHospitals);
router.delete('/delete/:id', protect, deleteUser);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/logs', protect, getSystemLogs);
router.post('/verify-password', protect, verifyAdminPassword);
router.post('/add-admin', protect, addAdmin);

export default router;