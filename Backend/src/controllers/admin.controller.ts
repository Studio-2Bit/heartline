import { Request, Response } from 'express';
import User from '../models/User.model';
import { DonorProfile } from '../models/Donor.model';
import { HospitalProfile } from '../models/Hospital.model';

// GET /api/admin/pending-donors
export const getPendingDonors = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'donor', isVerified: false }).lean();
    const enriched = await Promise.all(
      users.map(async (u) => {
        const profile = await DonorProfile.findOne({ userId: u._id });
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          bloodType: profile?.bloodType,
          phone: profile?.phone,
          location: profile?.location,
          registrationNumber: profile?.registrationNumber,
          totalDonations: profile?.totalDonations,
          createdAt: u.createdAt,
        };
      })
    );
    return res.status(200).json({ donors: enriched });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/admin/pending-hospitals
export const getPendingHospitals = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'hospital', isVerified: false }).lean();
    const enriched = await Promise.all(
      users.map(async (u) => {
        const profile = await HospitalProfile.findOne({ userId: u._id });
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          hospitalName: profile?.hospitalName,
          phone: profile?.phone,
          location: profile?.location,
          registrationNumber: profile?.registrationNumber,
          approvalNumber: profile?.approvalNumber,
          createdAt: u.createdAt,
        };
      })
    );
    return res.status(200).json({ hospitals: enriched });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/admin/all-donors
export const getAllDonors = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'donor' }).lean();
    const enriched = await Promise.all(
      users.map(async (u) => {
        const profile = await DonorProfile.findOne({ userId: u._id });
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          bloodType: profile?.bloodType,
          phone: profile?.phone,
          location: profile?.location,
          totalDonations: profile?.totalDonations ?? 0,
          availabilityStatus: profile?.availabilityStatus,
          isVerified: u.isVerified,
          createdAt: u.createdAt,
        };
      })
    );
    return res.status(200).json({ donors: enriched });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/admin/all-hospitals
export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'hospital' }).lean();
    const enriched = await Promise.all(
      users.map(async (u) => {
        const profile = await HospitalProfile.findOne({ userId: u._id });
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          hospitalName: profile?.hospitalName,
          phone: profile?.phone,
          location: profile?.location,
          registrationNumber: profile?.registrationNumber,
          approvalNumber: profile?.approvalNumber,
          isVerified: u.isVerified,
          createdAt: u.createdAt,
        };
      })
    );
    return res.status(200).json({ hospitals: enriched });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/admin/verify/:id
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'hospital') {
      await HospitalProfile.findOneAndUpdate({ userId: id }, { isVerified: true });
    }
    return res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /api/admin/reject/:id
export const rejectUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'donor') await DonorProfile.findOneAndDelete({ userId: id });
    if (user.role === 'hospital') await HospitalProfile.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User rejected and removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /api/admin/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'donor') await DonorProfile.findOneAndDelete({ userId: id });
    if (user.role === 'hospital') await HospitalProfile.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};