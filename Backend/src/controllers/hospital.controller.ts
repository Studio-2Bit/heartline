import { Request, Response } from 'express';
import { HospitalProfile } from '../models/Hospital.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

// POST /api/hospital/complete
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // get user ID from token
    const { hospitalName, location, phone, registrationNumber, approvalNumber } = req.body;

    // Check if profile already exists
    const existing = await HospitalProfile.findById(userId);
    if (existing) {
      return res.status(400).json({ message: 'Profile already completed' });
    }

    // Create profile using userId as _id
    const profile = await HospitalProfile.create({
      _id: userId,
      userId: userId,
      hospitalName,
      location,
      phone,
      registrationNumber,
      approvalNumber,
    });

    // Mark user's profile as completed
    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    return res.status(201).json({
      message: 'Hospital profile submitted for review',
      profile,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/hospital
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const profile = await HospitalProfile.findById(userId).populate('userId', 'name email role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/hospital
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { hospitalName, location, phone, registrationNumber, approvalNumber } = req.body;

    const updateData: any = {};
    if (hospitalName) updateData.hospitalName = hospitalName;
    if (location) updateData.location = location;
    if (phone) updateData.phone = phone;
    if (registrationNumber) updateData.registrationNumber = registrationNumber;
    if (approvalNumber) updateData.approvalNumber = approvalNumber;

    // Update the profile using userId as _id
    const profile = await HospitalProfile.findByIdAndUpdate(userId, updateData, { new: true });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ message: 'Profile updated', profile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};