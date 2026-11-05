import mongoose, { Schema, Document } from "mongoose";

export interface IStockTransaction extends Document {
  sku: string;
  productId: string;
  productName: string;
  variationId?: string;
  type: string; // "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "DAMAGE" | "RESERVATION" | "RELEASE"
  quantityDelta: number;
  newStockLevel: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
  timestamp: string;
}

const StockTransactionSchema = new Schema<IStockTransaction>(
  {
    sku: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variationId: { type: String, default: "" },
    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "ADJUSTMENT", "RETURN", "DAMAGE", "RESERVATION", "RELEASE"],
      required: true,
    },
    quantityDelta: { type: Number, required: true },
    newStockLevel: { type: Number, required: true },
    reason: { type: String, required: true },
    referenceId: { type: String, default: "" },
    performedBy: { type: String, default: "Admin" },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

StockTransactionSchema.index({ sku: 1 });
StockTransactionSchema.index({ productId: 1 });
StockTransactionSchema.index({ type: 1 });
StockTransactionSchema.index({ createdAt: -1 });

export default mongoose.models.StockTransaction || mongoose.model<IStockTransaction>("StockTransaction", StockTransactionSchema);
