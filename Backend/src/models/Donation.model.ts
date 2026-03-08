import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  donationDate: Date;
  donationTime: string;
  bloodType: string;
  notes?: string;
  status: 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donationDate: {
      type: Date,
      required: true,
    },
    donationTime: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'Completed',
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);