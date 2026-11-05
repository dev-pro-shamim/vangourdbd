import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    details: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

AuditLogSchema.index({ module: 1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
