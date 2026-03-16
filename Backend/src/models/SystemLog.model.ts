import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemLog extends Document {
  type: 'info' | 'warning' | 'error';
  action: string;
  user: string;
  details: string;
  createdAt: Date;
}

const SystemLogSchema = new Schema<ISystemLog>(
  {
    type:    { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
    action:  { type: String, required: true },
    user:    { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export const SystemLog = mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);