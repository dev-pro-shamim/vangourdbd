import mongoose, { Schema, Document } from "mongoose";

export interface IFloatingContactSettings extends Document {
  isEnabled: boolean;
  position: "bottom-left" | "bottom-right";
  buttons: Array<{
    id: string;
    type: string;
    label: string;
    value: string;
    color: string;
    icon: string;
    enabled: boolean;
    showOnDesktop: boolean;
    showOnMobile: boolean;
  }>;
}

const FloatingContactSettingsSchema = new Schema<IFloatingContactSettings>(
  {
    isEnabled: { type: Boolean, default: true },
    position: { type: String, enum: ["bottom-left", "bottom-right"], default: "bottom-right" },
    buttons: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
        color: { type: String, default: "#25D366" },
        icon: { type: String, default: "message-circle" },
        enabled: { type: Boolean, default: true },
        showOnDesktop: { type: Boolean, default: true },
        showOnMobile: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.FloatingContactSettings || mongoose.model<IFloatingContactSettings>("FloatingContactSettings", FloatingContactSettingsSchema);
