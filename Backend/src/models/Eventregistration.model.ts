import mongoose, { Schema, Document } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  bloodType: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  timeSlot: string;
  healthNotes?: string;
  status: 'registered' | 'attended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    bloodType: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    timeSlot: { type: String, required: true },
    healthNotes: { type: String, default: null },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
  },
  { timestamps: true }
);

export const EventRegistration = mongoose.model<IEventRegistration>(
  'EventRegistration',
  EventRegistrationSchema
);