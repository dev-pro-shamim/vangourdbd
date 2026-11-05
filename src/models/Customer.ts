import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
  orderCount: number;
  lifetimeValue: number;
  status: "Active" | "Blocked" | "VIP";
  notes?: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    addresses: { type: [String], default: [] },
    orderCount: { type: Number, default: 0 },
    lifetimeValue: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Blocked", "VIP"], default: "Active" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ orderCount: -1 });
CustomerSchema.index({ lifetimeValue: -1 });

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
