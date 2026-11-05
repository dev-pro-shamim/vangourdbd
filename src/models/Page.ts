import mongoose, { Schema, Document, Model } from "mongoose";
import { PageItem as IPageItem } from "@/types/cms";

export interface PageDocument extends Document, Omit<IPageItem, "id"> {}

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isSystem: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    template: { type: String, default: "default" },
    content: { type: String, default: "" },
    sections: [{ type: Schema.Types.Mixed }],
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const PageModel: Model<PageDocument> =
  mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);
