import mongoose, { Schema, Document } from "mongoose";

export interface ISupportTicket extends Document {
  subject: string;
  message: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  attachments?: string[];
  status: string;
  createdAt: string;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderName: { type: String, default: "Admin" },
    recipientEmail: { type: String, default: "shamimjkrworld@gmail.com" },
    attachments: { type: [String], default: [] },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ createdAt: -1 });

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
