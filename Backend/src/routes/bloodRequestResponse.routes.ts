import express from 'express';
import { respondToRequest, getRequestResponses, getDonorResponses } from '../controllers/bloodRequestResponse.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/:requestId', protect, respondToRequest);
router.get('/request/:requestId', protect, getRequestResponses);
router.get('/donor', protect, getDonorResponses);

export default router;