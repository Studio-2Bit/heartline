import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  hospitalId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  expectedDonors?: number;
  contactPerson: string;
  contactPhone: string;
  status: 'pending' | 'active' | 'rejected' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    expectedDonors: { type: Number, default: null },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);