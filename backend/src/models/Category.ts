import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  parentId?: string | null;
  level: number;
  productCount: number;
  description?: string;
  order: number;
  isEnabled: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    parentId: { type: String, default: null },
    level: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ order: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
