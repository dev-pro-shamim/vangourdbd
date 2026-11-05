import mongoose, { Schema, Document } from "mongoose";

export interface IBlockedIP extends Document {
  ip: string;
  reason: string;
  isManual: boolean;
  expiresAt?: string;
}

const BlockedIPSchema = new Schema<IBlockedIP>(
  {
    ip: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    isManual: { type: Boolean, default: false },
    expiresAt: { type: String },
  },
  { timestamps: true }
);

BlockedIPSchema.index({ ip: 1 });

export default mongoose.models.BlockedIP || mongoose.model<IBlockedIP>("BlockedIP", BlockedIPSchema);
