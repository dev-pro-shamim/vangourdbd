import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string;
  costPrice?: number;
  price: number;
  compareAtPrice: number;
  discountPercentage?: number;
  isStockOut: boolean;
  isFeatured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  reservedStock?: number;
  description: string;
  shortDescription?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  variations?: Array<{
    id: string;
    sku: string;
    name: string;
    attributes: Record<string, string>;
    regularPrice: number;
    salePrice?: number;
    stockQuantity: number;
    reservedStock?: number;
    image?: string;
    status: string;
  }>;
  relatedProductIds?: string[];
  upsellProductIds?: string[];
  crossSellProductIds?: string[];
  lowStockThreshold?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    categoryId: { type: String, default: "" },
    subcategoryId: { type: String, default: "" },
    brand: { type: String, default: "VANGUARD" },
    costPrice: { type: Number, default: 0 },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    isStockOut: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stockQuantity: { type: Number, default: 50 },
    reservedStock: { type: Number, default: 0 },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    variations: { type: [Schema.Types.Mixed], default: [] },
    relatedProductIds: { type: [String], default: [] },
    upsellProductIds: { type: [String], default: [] },
    crossSellProductIds: { type: [String], default: [] },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ categorySlug: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
