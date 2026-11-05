import mongoose, { Schema, Document } from "mongoose";

export interface IWebsiteText extends Document {
  id: string;
  group: string;
  key: string;
  label: string;
  value: string;
  defaultValue?: string;
  description?: string;
  updatedAt: string;
}

const WebsiteTextSchema = new Schema<IWebsiteText>(
  {
    id: { type: String, required: true, unique: true },
    group: { type: String, required: true, index: true },
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    defaultValue: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const WebsiteTextModel =
  mongoose.models.WebsiteText || mongoose.model<IWebsiteText>("WebsiteText", WebsiteTextSchema);
