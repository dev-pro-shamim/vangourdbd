import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: string;
  productName: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  reviewText: string;
  status: "Pending" | "Approved" | "Rejected";
  isVerifiedPurchase: boolean;
  adminReply?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    isVerifiedPurchase: { type: Boolean, default: false },
    adminReply: { type: String, default: "" },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ rating: 1 });

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
