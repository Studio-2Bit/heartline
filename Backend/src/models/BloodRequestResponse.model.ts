import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequestResponse extends Document {
  requestId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  
  
  createdAt: Date;
}

const BloodRequestResponseSchema = new Schema<IBloodRequestResponse>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
    donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   
  },
  { timestamps: true }
);

export const BloodRequestResponse = mongoose.model<IBloodRequestResponse>(
  'BloodRequestResponse',
  BloodRequestResponseSchema
);