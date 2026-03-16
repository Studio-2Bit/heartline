import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { EventRegistration } from '../models/Eventregistration.model';
import { Event } from '../models/Event.model';

// POST /api/event-registrations/:eventId
export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const donorId = (req as any).user.id;
    const { eventId } = req.params;
    const { fullName, phone, bloodType, age, gender, timeSlot, healthNotes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'active') return res.status(400).json({ message: 'Event is not available for registration' });

    const existing = await EventRegistration.findOne({ eventId, donorId });
    if (existing) return res.status(400).json({ message: 'You have already registered for this event' });

    const registration = await EventRegistration.create({
      eventId: new mongoose.Types.ObjectId(eventId),
      donorId: new mongoose.Types.ObjectId(donorId),
      fullName, phone, bloodType,
      age: Number(age),
      gender, timeSlot,
      ...(healthNotes && { healthNotes }),
    });

    return res.status(201).json({ message: 'Successfully registered for the event', registration });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/event-registrations/donor
export const getDonorRegistrations = async (req: Request, res: Response) => {
  try {
    const donorId = (req as any).user.id;

    const registrations = await EventRegistration.find({ donorId })
      .populate('eventId', 'title date time location status')
      .sort({ createdAt: -1 });

    
    const formatted = registrations.map((r) => ({
      _id: r._id,
      fullName: r.fullName,
      bloodType: r.bloodType,
      timeSlot: r.timeSlot,
      status: r.status,
      createdAt: r.createdAt,
      event: r.eventId,  
    }));

    return res.status(200).json({ registrations: formatted });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/event-registrations/event/:eventId
export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ eventId })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ registrations });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/event-registrations/:id/cancel
export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const donorId = (req as any).user.id;
    const { id } = req.params;

    const registration = await EventRegistration.findOneAndUpdate(
      { _id: id, donorId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    return res.status(200).json({ message: 'Registration cancelled', registration });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/event-registrations/:id/attend
export const markAttended = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      { status: 'attended' },
      { new: true }
    );

    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    return res.status(200).json({ message: 'Marked as attended', registration });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};