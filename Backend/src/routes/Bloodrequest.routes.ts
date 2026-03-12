import express from 'express';
import {
  createRequest,
  getAllRequests,
  getHospitalRequests,
  updateRequestStatus,
  deleteRequest,
  getDonorSuggestions
} from '../controllers/Bloodrequest.controller';
import { protect } from '../middlewares/auth.middleware';


const router = express.Router();

// Donor routes
router.get('/', protect, getAllRequests);                        // GET all active requests (donor sees)

// Hospital routes
router.post('/', protect, createRequest);                       // POST create new request
router.get('/hospital', protect, getHospitalRequests);          // GET hospital's own requests
router.patch('/:id/status', protect, updateRequestStatus);      // PATCH update status
router.delete('/:id', protect, deleteRequest);                  // DELETE cancel request
router.get('/:id/suggestions', protect, getDonorSuggestions); // GET donor suggestions based on location and blood type

export default router;