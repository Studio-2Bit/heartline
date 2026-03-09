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
  },
  { timestamps: true }
);

export default mongoose.model<IDonor>("Donor", DonorSchema);