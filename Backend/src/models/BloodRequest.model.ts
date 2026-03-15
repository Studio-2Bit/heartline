import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequest extends Document {
  hospitalId: mongoose.Types.ObjectId;
  bloodType: string;
  urgency: string;
  unitsNeeded: number;
  contactPerson: string;
  contactPhone: string; 
  notes?: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    urgency: {
      type: String,
      required: true,
      enum: ['Critical', 'High', 'Medium', 'Low'],
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
    },
    contactPerson: {
      type: String,
      required: true,
    },

    contactPhone: {           // ← add this
  type: String,
  required: true,
  },
    notes: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'fulfilled', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);