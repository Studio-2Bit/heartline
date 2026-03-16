import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BloodRequest } from '../models/BloodRequest.model';
import { getDistanceKm } from '../utils/haversine';
import { HospitalProfile } from '../models/Hospital.model';
import { DonorProfile } from '../models/Donor.model';
import { sendSMS } from '../utils/sms';
import { createNotification } from '../utils/notify';
import User from '../models/User.model';

// POST /api/blood-requests
// Hospital creates a new blood request
export const createRequest = async (req: Request, res: Response) => {
  try {
   
    const hospitalId = (req as any).user.id;
    const { bloodType, urgency, unitsNeeded, contactPerson, contactPhone, notes } = req.body;

    const request = await BloodRequest.create({
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      bloodType,
      urgency,
      unitsNeeded,
      contactPerson,
      contactPhone,
      ...(notes && { notes }),
    });
    const hospital = await User.findById(hospitalId);
const matchingDonors = await DonorProfile.find({
  bloodType: bloodType,
  availabilityStatus: 'available',
});

await Promise.all(
  matchingDonors.map(async (donor) => {
    await createNotification(
      donor.userId.toString(),
      'request',
      'Blood Request Matches Your Type',
      `${hospital?.name} urgently needs ${bloodType} blood.`
    );
    await sendSMS(
      donor.phone,
      `Heartline: ${hospital?.name} urgently needs ${bloodType} blood. You are a match! Please log in to respond.`
    );
  })
);

    return res.status(201).json({
      message: 'Blood request created successfully',
      request,
    });
  } catch (error) {
      
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/blood-requests

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const { bloodType } = req.query;

    const filter: any = { status: 'active' };
    if (bloodType) filter.bloodType = bloodType;

    const requests = await BloodRequest.find(filter)
      .populate('hospitalId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/blood-requests/hospital
// Hospital sees their own requests
export const getHospitalRequests = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;

const requests = await BloodRequest.find({ 
  hospitalId: new mongoose.Types.ObjectId(hospitalId) 
}).sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/blood-requests/:id/status
// Hospital updates request status
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { id } = req.params;
    const { status } = req.body;

    const request = await BloodRequest.findOneAndUpdate(
      { _id: id, hospitalId },
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({ message: 'Status updated', request });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /api/blood-requests/:id
// Hospital cancels a request
export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const hospitalId = (req as any).user.id;
    const { id } = req.params;

    const request = await BloodRequest.findOneAndDelete({ _id: id, hospitalId });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({ message: 'Request deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getDonorSuggestions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Get the blood request
    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // 2. Get hospital coordinates
    const hospitalProfile = await HospitalProfile.findOne({ 
      userId: request.hospitalId 
    });

    // 3. Find matching available donors
    const donors = await DonorProfile.find({
      bloodType: request.bloodType,
      availabilityStatus: 'available',
    }).populate('userId', 'name email');

    // 4. Calculate distance for each donor and sort
    const suggestions = donors
      .map((donor) => {
        const user = donor.userId as any;
        let distance = null;

        if (
          hospitalProfile?.latitude && hospitalProfile?.longitude &&
          donor.latitude && donor.longitude
        ) {
          distance = getDistanceKm(
            hospitalProfile.latitude, hospitalProfile.longitude,
            donor.latitude, donor.longitude
          );
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: donor.phone,
          bloodType: donor.bloodType,
          location: donor.location,
          availabilityStatus: donor.availabilityStatus,
          totalDonations: donor.totalDonations,
          distance: distance ? Math.round(distance * 10) / 10 : null,
        };
      })
      .sort((a, b) => {
        // Sort by distance, null distances go to end
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

    return res.status(200).json({ suggestions });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};