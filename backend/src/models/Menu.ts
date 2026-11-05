import mongoose, { Schema, Document, Model } from "mongoose";
import { Menu as IMenu } from "@/types/cms";

export interface MenuDocument extends Document, Omit<IMenu, "id"> {}

const MenuItemSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  href: { type: String, required: true },
  isHighlight: { type: Boolean, default: false },
  target: { type: String, default: "_self" },
  children: [{ type: Schema.Types.Mixed }],
});

const MenuSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true, unique: true },
    items: [MenuItemSchema],
  },
  { timestamps: true }
);

export const MenuModel: Model<MenuDocument> =
  mongoose.models.Menu || mongoose.model<MenuDocument>("Menu", MenuSchema);
