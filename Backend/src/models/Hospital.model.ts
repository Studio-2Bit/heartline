<<<<<<< HEAD
import mongoose, { Document, Schema } from "mongoose";

export interface IHospital extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  licenseNumber: string;
  isVerified: boolean;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    licenseNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
=======
import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalProfile extends Document {
  userId: mongoose.Types.ObjectId;
  hospitalName: string;
  location: string;
  phone: string;
  registrationNumber: string;
  approvalNumber: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalProfileSchema = new Schema<IHospitalProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    approvalNumber: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
>>>>>>> 0bbeadc733ff949c1aa37a11507a967d0aa1da5a
  },
  { timestamps: true }
);

<<<<<<< HEAD
export default mongoose.model<IHospital>("Hospital", HospitalSchema);
=======
export const HospitalProfile = mongoose.model<IHospitalProfile>('HospitalProfile', HospitalProfileSchema);
>>>>>>> 0bbeadc733ff949c1aa37a11507a967d0aa1da5a
