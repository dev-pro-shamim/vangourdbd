import mongoose, { Schema, Document, Model } from "mongoose";
import { Section as ISection } from "@/types/cms";

export interface SectionDocument extends Document, Omit<ISection, "id"> {}

const SectionSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    eyebrow: { type: String },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    pageSlug: { type: String, default: "home" },
    styles: {
      bgColor: { type: String },
      textColor: { type: String },
      paddingTop: { type: String },
      paddingBottom: { type: String },
      marginTop: { type: String },
      marginBottom: { type: String },
      containerMaxWidth: { type: String },
      customClass: { type: String },
    },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const SectionModel: Model<SectionDocument> =
  mongoose.models.Section || mongoose.model<SectionDocument>("Section", SectionSchema);
