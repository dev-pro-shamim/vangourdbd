import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: "Dhaka" | "Outside Dhaka";
  district?: string;
  items: Array<{
    productId: string;
    variationId?: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    sku?: string;
  }>;
  subtotal: number;
  discount?: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  courierName?: string;
  consignmentId?: string;
  trackingCode?: string;
  courierStatus?: string;
  timeline: Array<{
    status: string;
    note: string;
    timestamp: string;
    updatedBy: string;
  }>;
  internalNotes: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
  auditHistory: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    changedBy: string;
    changedAt: string;
  }>;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, enum: ["Dhaka", "Outside Dhaka"], required: true },
    district: { type: String, default: "" },
    items: [
      {
        productId: { type: String, required: true },
        variationId: { type: String, default: "" },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, default: "" },
        color: { type: String, default: "" },
        sku: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Ready to Ship",
        "Shipped",
        "In Transit",
        "Delivered",
        "Cancelled",
        "Returned",
        "Refunded",
        "On Hold",
      ],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    courierName: { type: String, default: "" },
    consignmentId: { type: String, default: "" },
    trackingCode: { type: String, default: "" },
    courierStatus: { type: String, default: "" },
    timeline: { type: [Schema.Types.Mixed], default: [] },
    internalNotes: { type: [Schema.Types.Mixed], default: [] },
    auditHistory: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
