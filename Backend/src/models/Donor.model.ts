import mongoose, { Schema, Document } from 'mongoose';

export interface IDonorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  location: string;
   latitude: number | null;
   longitude: number | null;
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
    latitude: { type: Number, default: null },  

    longitude: { type: Number, default: null }, 
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
      default: 'available',
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

  },
  { timestamps: true }
);

export const DonorProfile = mongoose.model<IDonorProfile>('DonorProfile', DonorProfileSchema);