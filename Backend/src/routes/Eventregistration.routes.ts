import express from 'express';
import {
  registerForEvent,
  getDonorRegistrations,
  getEventRegistrations,
  cancelRegistration,
  markAttended,
} from '../controllers/Eventregistration.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Donor registers for an event
router.post('/:eventId', protect, registerForEvent);

// Donor sees their own registrations
router.get('/donor', protect, getDonorRegistrations);

// Hospital sees all registrations for a specific event
router.get('/event/:eventId', protect, getEventRegistrations);

// Donor cancels registration
router.patch('/:id/cancel', protect, cancelRegistration);

// Hospital marks donor as attended
router.patch('/:id/attend', protect, markAttended);

export default router;