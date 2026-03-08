import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Donation } from '../models/Donation.model';
import { DonorProfile } from '../models/Donor.model';
import User from '../models/User.model';

// GET /api/donations/search?donorId=D001
// Hospital searches for a donor by their userId or donorId
export const searchDonor = async (req: Request, res: Response) => {
  try {
    const { donorId } = req.query;

    if (!donorId) {
      return res.status(400).json({ message: 'Donor ID is required' });
    }

    // Find user by id
    const user = await User.findById(donorId).select('name email role');
    if (!user || user.role !== 'donor') {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Get their profile
    const profile = await DonorProfile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    return res.status(200).json({
      donor: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: profile.phone,
        bloodType: profile.bloodType,
        location: profile.location,
        availabilityStatus: profile.availabilityStatus,
        lastDonationDate: profile.lastDonationDate,
        nextEligibleDate: profile.nextEligibleDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// POST /api/donations/mark
// Hospital marks a donor as donated
export const markDonation = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { donorId, donationDate, donationTime, notes } = req.body;

    // Get donor profile to get blood type
    const profile = await DonorProfile.findOne({
      userId: new mongoose.Types.ObjectId(donorId),
    });

    if (!profile) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    // Create donation record
    const donation = await Donation.create({
      donorId: new mongoose.Types.ObjectId(donorId),
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      donationDate: new Date(donationDate),
      donationTime,
      bloodType: profile.bloodType,
      ...(notes && { notes }),
    });

    // Calculate next eligible date = donation date + 90 days
    const donationDateObj = new Date(donationDate);
    const nextEligibleDate = new Date(donationDateObj);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

    // Update donor profile — mark unavailable + set dates
    await DonorProfile.findOneAndUpdate(
      { userId: donorId },
      {
        availabilityStatus: 'unavailable',
        lastDonationDate: donationDateObj,
        nextEligibleDate,
        $inc: { totalDonations: 1 },
      }
    );

    return res.status(201).json({
      message: 'Donation recorded successfully',
      donation,
      nextEligibleDate,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/donations/recent
// Hospital gets their recent donation records
export const getRecentDonations = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;

    const donations = await Donation.find({ hospitalId })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ donations });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};