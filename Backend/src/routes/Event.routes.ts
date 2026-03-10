import express from 'express';
import {
  createEvent,
  getActiveEvents,
  getHospitalEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  cancelEvent,
} from '../controllers/Event.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', protect, getActiveEvents);              // Donors — see active events only
router.post('/', protect, createEvent);                 // Hospital — create event (pending)
router.get('/hospital', protect, getHospitalEvents);    // Hospital — see their own events
router.get('/pending', protect, getPendingEvents);      // Admin — see pending events
router.patch('/:id/approve', protect, approveEvent);    // Admin — approve → active
router.patch('/:id/reject', protect, rejectEvent);      // Admin — reject
router.patch('/:id/cancel', protect, cancelEvent);      // Hospital — cancel

export default router;