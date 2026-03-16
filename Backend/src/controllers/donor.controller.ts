import { Request, Response } from 'express';
import { DonorProfile } from '../models/Donor.model';
import User from '../models/User.model';
import mongoose from 'mongoose';
import { createNotification } from '../utils/notify';
import { sendSMS } from '../utils/sms';
import { uploadToCloudinary } from '../config/cloudinary';


// POST /api/donor/profile/complete
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { location, phone, bloodType, registrationNumber, latitude, longitude } = req.body;

    
    

    // Try Cloudinary upload — skip if it fails
    let idProof: string | undefined;
    if (req.file) {
      try {
        idProof = await uploadToCloudinary(req.file.buffer, `idproof-${Date.now()}`);
        console.log('Cloudinary upload success:', idProof);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        
      }
    }

    const existing = await DonorProfile.findOne({ userId });
    if (existing) {
      await User.findByIdAndUpdate(userId, { profileCompleted: true });
      return res.status(200).json({
        message: 'Profile completed successfully',
        profile: existing,
      });
    }

    const profile = await DonorProfile.create({
      userId: new mongoose.Types.ObjectId(userId),
      location,
      phone,
      bloodType,
      ...(registrationNumber && { registrationNumber }),
      ...(idProof && { idProof }),
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
    });

    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    return res.status(201).json({
      message: 'Profile completed successfully',
      profile,
    });
  } catch (error) {
    console.error('completeProfile error:', error);
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

    // Check if donor is eligible to donate again
    const today = new Date();
    if (
      profile.availabilityStatus === 'unavailable' &&
      profile.nextEligibleDate &&
      new Date(profile.nextEligibleDate) <= today
    ) {
      await DonorProfile.findOneAndUpdate({ userId }, { availabilityStatus: 'available' });

      await createNotification(
        userId,
        'success',
        'You Can Donate Again! 🩸',
        'Your 90-day waiting period is over. You are now eligible to donate blood again.'
      );

      if (profile.phone) {
        await sendSMS(
          profile.phone,
          `Heartline: Your 90-day waiting period is over. You are now eligible to donate blood again!`
        );
      }
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
    const { location, phone, bloodType, registrationNumber, latitude, longitude } = req.body;

    // Upload to Cloudinary if file exists
    let idProof: string | undefined;
    if (req.file) {
      idProof = await uploadToCloudinary(req.file.buffer, `idproof-${Date.now()}`);
    }

    const updateData: any = { location, phone, bloodType, registrationNumber };
    if (idProof) updateData.idProof = idProof;
    if (latitude) updateData.latitude = Number(latitude);
    if (longitude) updateData.longitude = Number(longitude);

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