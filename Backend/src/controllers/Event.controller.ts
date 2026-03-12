import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Event } from '../models/Event.model';

// POST /api/events
// Hospital creates event — saved as pending until admin approves
export const createEvent = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { title, date, time, location, description, expectedDonors, contactPerson, contactPhone } = req.body;

    const event = await Event.create({
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      title,
      date: new Date(date),
      time,
      location,
      description,
      contactPerson,
      contactPhone,
      ...(expectedDonors && { expectedDonors: Number(expectedDonors) }),
      status: 'active', // always starts as pending
    });

    return res.status(201).json({
      message: 'Event submitted. Waiting for admin approval.',
      event,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/events/:id
// Get single event by id
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('hospitalId', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/events
// Donors see only active (admin approved) events
export const getActiveEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ status: 'active' })
      .populate('hospitalId', 'name email')
      .sort({ date: 1 });

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/events/hospital
// Hospital sees their own events with all statuses
export const getHospitalEvents = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;

    const events = await Event.find({ hospitalId }).sort({ createdAt: -1 });

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/events/pending  — Admin sees all pending events
export const getPendingEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('hospitalId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/events/:id/approve  — Admin approves → status becomes active
export const approveEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'pending' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event approved and now visible to donors', event });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/events/:id/reject  — Admin rejects event
export const rejectEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event rejected', event });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/events/:id/cancel  — Hospital cancels their own event
export const cancelEvent = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { id } = req.params;

    const event = await Event.findOneAndUpdate(
      { _id: id, hospitalId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event cancelled', event });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};