<<<<<<< HEAD
import mongoose, { Document, Schema } from "mongoose";

export interface IDonor extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  bloodType: string;
  isVerified: boolean;
}

const DonorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    bloodType: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
=======
import mongoose, { Schema, Document } from 'mongoose';

export interface IDonorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  location: string;
  phone: string;
  bloodType: string;
  registrationNumber?: string;
  idProof?: string;
  availabilityStatus: 'available' | 'unavailable';
  lastDonationDate?: Date;
  nextEligibleDate?: Date;
  totalDonations: number;
  createdAt: Date;
  updatedAt: Date;
}

const DonorProfileSchema = new Schema<IDonorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    registrationNumber: {
      type: String,
      default: null,
    },
    idProof: {
      type: String, // stores file path or URL
      default: null,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'unavailable',
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    nextEligibleDate: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
>>>>>>> 0bbeadc733ff949c1aa37a11507a967d0aa1da5a
  },
  { timestamps: true }
);

<<<<<<< HEAD
export default mongoose.model<IDonor>("Donor", DonorSchema);
=======
export const DonorProfile = mongoose.model<IDonorProfile>('DonorProfile', DonorProfileSchema);
>>>>>>> 0bbeadc733ff949c1aa37a11507a967d0aa1da5a
