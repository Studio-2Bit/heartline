import { Request, Response } from 'express';
import { DonorProfile } from '../models/Donor.model';
import  User  from '../models/User.model';
import path from 'path';

// POST /api/donor/profile/complete
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { location, phone, bloodType, registrationNumber } = req.body;

    // Get uploaded file path if exists
    const idProof = req.file ? req.file.filename : undefined;  

    // Check if profile already exists
    const existing = await DonorProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Profile already completed' });
    }

    // Create donor profile
    const profile = await DonorProfile.create({
      userId,
      location,
      phone,
      bloodType,
      registrationNumber: registrationNumber || null,
      idProof,
    });

    // Mark profileCompleted = true on User
    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    return res.status(201).json({
      message: 'Profile completed successfully',
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/donor/profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const profile = await DonorProfile.findOne({ userId }).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PUT /api/donor/profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { location, phone, bloodType, registrationNumber } = req.body;

    const idProof = req.file ? req.file.filename : undefined;

    const updateData: any = { location, phone, bloodType, registrationNumber };
    if (idProof) updateData.idProof = idProof;

    const profile = await DonorProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ message: 'Profile updated', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};