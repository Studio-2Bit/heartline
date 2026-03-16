import { Request, Response } from 'express';
import { HospitalProfile } from '../models/Hospital.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

// POST /api/hospital/profile/complete
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { hospitalName, location, phone, registrationNumber, approvalNumber, latitude, longitude } = req.body;

    // Check if profile already exists
    const existing = await HospitalProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Profile already completed' });
    }

    const profile = await HospitalProfile.create({
      userId: new mongoose.Types.ObjectId(userId),
      hospitalName,
      location,
      phone,
      registrationNumber,
      approvalNumber,
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
    });

    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    return res.status(201).json({
      message: 'Hospital profile submitted for review',
      profile,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/hospital/profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const profile = await HospitalProfile.findOne({ userId }).populate('userId', 'name email role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/hospital/profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { hospitalName, location, phone, registrationNumber, approvalNumber, latitude, longitude } = req.body;

    const updateData: any = {};
    if (hospitalName) updateData.hospitalName = hospitalName;
    if (location) updateData.location = location;
    if (phone) updateData.phone = phone;
    if (registrationNumber) updateData.registrationNumber = registrationNumber;
    if (approvalNumber) updateData.approvalNumber = approvalNumber;
    if (latitude) updateData.latitude = Number(latitude);
    if (longitude) updateData.longitude = Number(longitude);

    const profile = await HospitalProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ message: 'Profile updated', profile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};