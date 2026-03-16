import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BloodRequestResponse } from '../models/BloodRequestResponse.model';
import { DonorProfile } from '../models/Donor.model';
import { BloodRequest } from '../models/BloodRequest.model';

// POST /api/blood-request-responses/:requestId
export const respondToRequest = async (req: Request, res: Response) => {
  try {
    const donorId = (req as any).user.id;
    const { requestId } = req.params;
    const { message } = req.body;

    const existing = await BloodRequestResponse.findOne({ requestId, donorId });
    if (existing) {
      return res.status(400).json({ message: 'You have already responded to this request' });
    }

    const response = await BloodRequestResponse.create({
      requestId: new mongoose.Types.ObjectId(requestId),
      donorId: new mongoose.Types.ObjectId(donorId),
      ...(message && { message }),
    });

    return res.status(201).json({ message: 'Response submitted successfully', response });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/blood-request-responses/request/:requestId
export const getRequestResponses = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const responses = await BloodRequestResponse.find({ requestId })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      responses.map(async (r) => {
        const user = r.donorId as any;
        const profile = await DonorProfile.findOne({ userId: user._id });
        return {
          _id: r._id,
          createdAt: r.createdAt,
          donor: {
            _id: user._id,
            name: user.name,
            email: user.email,
            bloodType: profile?.bloodType,
            phone: profile?.phone,
            location: profile?.location,
            availabilityStatus: profile?.availabilityStatus,
          },
        };
      })
    );

    return res.status(200).json({ responses: enriched });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/blood-request-responses/donor
export const getDonorResponses = async (req: Request, res: Response) => {
  try {
    const donorId = (req as any).user.id;

    const responses = await BloodRequestResponse.find({ donorId })
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      responses.map(async (r) => {
        // fetch blood request and populate hospitalId to get hospital name
        const bloodRequest = await BloodRequest.findById(r.requestId)
          .populate('hospitalId', 'name');

        const hospital = bloodRequest?.hospitalId as any;

        return {
          _id: r._id,
          createdAt: r.createdAt,
          request: {
            _id: bloodRequest?._id,
            bloodType: bloodRequest?.bloodType,
            urgency: bloodRequest?.urgency,
            status: bloodRequest?.status,
            hospitalName: hospital?.name ?? 'Unknown Hospital',
          },
        };
      })
    );

    return res.status(200).json({ responses: formatted });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};