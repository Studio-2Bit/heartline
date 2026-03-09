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
  },
  { timestamps: true }
);

export default mongoose.model<IHospital>("Hospital", HospitalSchema);