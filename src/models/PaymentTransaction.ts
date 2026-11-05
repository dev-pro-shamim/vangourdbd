import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentTransaction extends Document {
  orderId: string;
  gateway: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  verifiedServerSide: boolean;
  rawResponse?: any;
}

const PaymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    orderId: { type: String, required: true },
    gateway: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: { type: String, enum: ["Pending", "Success", "Failed", "Refunded"], default: "Pending" },
    verifiedServerSide: { type: Boolean, default: false },
    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ orderId: 1 });
PaymentTransactionSchema.index({ transactionId: 1 });

export default mongoose.models.PaymentTransaction || mongoose.model<IPaymentTransaction>("PaymentTransaction", PaymentTransactionSchema);
