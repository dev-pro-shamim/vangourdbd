import mongoose, { Schema, Document, Model } from "mongoose";
import { MediaItem as IMediaItem } from "@/types/cms";

export interface MediaDocument extends Document, Omit<IMediaItem, "id"> {}

const MediaSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "image/jpeg" },
    folder: { type: String, default: "general" },
    altText: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MediaModel: Model<MediaDocument> =
  mongoose.models.Media || mongoose.model<MediaDocument>("Media", MediaSchema);
