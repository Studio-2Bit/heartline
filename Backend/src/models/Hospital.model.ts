import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalProfile extends Document {
  _id: mongoose.Types.ObjectId;   // explicitly declare _id
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
    _id: {
      type: Schema.Types.ObjectId, // allow setting _id manually
      required: true,
    },
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
  },
  { timestamps: true }
);

export const HospitalProfile = mongoose.model<IHospitalProfile>(
  'HospitalProfile',
  HospitalProfileSchema
);