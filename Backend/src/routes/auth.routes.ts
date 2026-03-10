import { Router } from 'express';
import { login, register, getUsers, completeProfile } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getUsers);
router.put('/complete-profile', protect, completeProfile); // Protected route

export default router;