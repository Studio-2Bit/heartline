import { Request, Response } from 'express';
import User from '../models/User.model';
import { DonorProfile } from '../models/Donor.model';
import { HospitalProfile } from '../models/Hospital.model';
import { createLog } from '../utils/logger';
import { SystemLog } from'../models/SystemLog.model';
import bcrypt from 'bcryptjs';

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
    await createLog('info', 'User Verified', user.name, `${user.role} account verified by admin`);
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
    await createLog('warning', 'User Rejected', user.name, `${user.role} account rejected and deleted`);
    return res.status(200).json({ message: 'User rejected and removed' });
    
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/admin/logs
export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const logs = await SystemLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ logs });
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
    await createLog('error', 'User Deleted', user.name, `${user.role} account deleted by admin`);
    return res.status(200).json({ message: 'User deleted' });
    
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/admin/dashboard-stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalDonors,
      totalHospitals,
      totalUsers,
      pendingDonors,
      pendingHospitals,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'hospital' }),
      User.countDocuments(),
      User.countDocuments({ role: 'donor', isVerified: false }),
      User.countDocuments({ role: 'hospital', isVerified: false }),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const pendingVerifications = pendingDonors + pendingHospitals;

    const recentActivities = recentUsers.map((u) => ({
      action: u.role === 'donor' ? 'New donor registered' : 'New hospital registered',
      user: u.name,
      time: u.createdAt,
      type: 'success',
    }));

    return res.status(200).json({
      stats: {
        totalDonors,
        totalHospitals,
        totalUsers,
        pendingVerifications,
      },
      recentActivities,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};



// POST /api/admin/verify-password
export const verifyAdminPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const admin = await User.findById((req as any).user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    return res.status(200).json({ message: 'Verified' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// POST /api/admin/add-admin
export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Admin',
      email,
      password: hashed,
      role: 'admin',
      isVerified: true,
      profileCompleted: true,
    });

    await createLog('info', 'Admin Added', email, 'New admin account created');

    return res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};