import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityLog extends Document {
  ip: string;
  userAgent: string;
  action: string;
  reason?: string;
  riskScore: number;
  status: string;
  timestamp: string;
}

const SecurityLogSchema = new Schema<ISecurityLog>(
  {
    ip: { type: String, required: true },
    userAgent: { type: String, default: "" },
    action: { type: String, required: true },
    reason: { type: String, default: "" },
    riskScore: { type: Number, default: 0 },
    status: { type: String, enum: ["ALLOWED", "BLOCKED", "FLAGGED"], default: "ALLOWED" },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

SecurityLogSchema.index({ ip: 1 });
SecurityLogSchema.index({ status: 1 });
SecurityLogSchema.index({ createdAt: -1 });

export default mongoose.models.SecurityLog || mongoose.model<ISecurityLog>("SecurityLog", SecurityLogSchema);
