import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usageLimitPerCustomer: number;
  usedCount: number;
  startDate?: string;
  expiryDate?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  customerEligibility: "all" | "logged_in" | "first_order_only";
  isFirstOrderOnly: boolean;
  freeShipping: boolean;
  status: "active" | "inactive";
  usages: Array<{
    orderId: string;
    customerPhone?: string;
    customerEmail?: string;
    discountAmount: number;
    usedAt: string;
  }>;
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    discountType: { type: String, enum: ["percentage", "fixed", "free_shipping"], default: "percentage" },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usageLimitPerCustomer: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    startDate: { type: String },
    expiryDate: { type: String },
    applicableProducts: [{ type: String }],
    applicableCategories: [{ type: String }],
    excludedProducts: [{ type: String }],
    excludedCategories: [{ type: String }],
    customerEligibility: { type: String, enum: ["all", "logged_in", "first_order_only"], default: "all" },
    isFirstOrderOnly: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    usages: [
      {
        orderId: { type: String, required: true },
        customerPhone: { type: String },
        customerEmail: { type: String },
        discountAmount: { type: Number, default: 0 },
        usedAt: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const CouponModel =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
