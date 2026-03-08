import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BloodRequest } from '../models/BloodRequest.model';

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

    return res.status(201).json({
      message: 'Blood request created successfully',
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/blood-requests
// Donors see all active requests
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