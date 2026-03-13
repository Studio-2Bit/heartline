import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Donation } from '../models/Donation.model';
import { DonorProfile } from '../models/Donor.model';
import User from '../models/User.model';

// GET /api/donations/search?donorId=<userId>
export const searchDonor = async (req: Request, res: Response) => {
  try {
    const { donorId } = req.query;
    if (!donorId) return res.status(400).json({ message: 'donorId is required' });

    const user = await User.findById(donorId);
    if (!user) return res.status(404).json({ message: 'Donor not found' });

    const profile = await DonorProfile.findOne({ userId: donorId });
    if (!profile) return res.status(404).json({ message: 'Donor profile not found' });

    return res.status(200).json({
      donor: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bloodType: profile.bloodType,
        phone: profile.phone,
        location: profile.location,
        availabilityStatus: profile.availabilityStatus,
        totalDonations: profile.totalDonations,
        lastDonationDate: profile.lastDonationDate,
        nextEligibleDate: profile.nextEligibleDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// POST /api/donations/mark
export const markDonation = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { donorId, donationDate, donationTime, bloodType, notes } = req.body;

    const donation = await Donation.create({
      donorId: new mongoose.Types.ObjectId(donorId),
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      donationDate,
      donationTime,
      bloodType,
      ...(notes && { notes }),
    });

    // Update donor profile
    const nextEligibleDate = new Date(donationDate);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

    await DonorProfile.findOneAndUpdate(
      { userId: donorId },
      {
        availabilityStatus: 'unavailable',
        lastDonationDate: donationDate,
        nextEligibleDate,
        $inc: { totalDonations: 1 },
      }
    );

    return res.status(201).json({ message: 'Donation marked successfully', donation });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/donations/recent  — hospital's recent donations
export const getRecentDonations = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;

    const donations = await Donation.find({
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
    })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ donations });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/donations/my  — donor's own donation history + rank
export const getMyDonations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get donor profile
    const profile = await DonorProfile.findOne({ userId }).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const user = profile.userId as any;

    

    // Get donation history
    const donations = await Donation.find({ donorId: userId })
      .populate('hospitalId', 'name')
      .sort({ donationDate: -1 });

    const formatted = donations.map((d, idx) => {
      const hospital = d.hospitalId as any;
      return {
        _id: d._id,
        id: donations.length - idx,
        hospital: hospital?.name ?? 'Unknown Hospital',
        date: new Date(d.donationDate).toLocaleDateString('en-US', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
        bloodType: d.bloodType,
        units: 1,
        status: d.status,
        notes: d.notes,
      };
    });

    return res.status(200).json({
      donor: {
        name: user.name,
        initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        totalDonations: profile.totalDonations,
        livesSaved: profile.totalDonations * 3,
        bloodType: profile.bloodType,
        lastDonationDate: profile.lastDonationDate,
        nextEligibleDate: profile.nextEligibleDate,
        nextMilestone: getNextMilestone(profile.totalDonations),
      },
      donations: formatted,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Helper — milestone thresholds
const getNextMilestone = (total: number) => {
  const milestones = [5, 10, 15, 25, 50, 100];
  const next = milestones.find((m) => m > total) ?? total + 10;
  return { current: total, total: next };
};