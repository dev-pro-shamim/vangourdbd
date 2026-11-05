import mongoose, { Schema, Document } from "mongoose";

export interface ICourierBooking extends Document {
  orderId: string;
  orderNumber: string;
  courierName: string;
  consignmentId: string;
  trackingCode: string;
  codAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: string;
  createdAt: string;
}

const CourierBookingSchema = new Schema<ICourierBooking>(
  {
    orderId: { type: String, required: true },
    orderNumber: { type: String, required: true },
    courierName: { type: String, enum: ["Steadfast", "Pathao", "RedX"], required: true },
    consignmentId: { type: String, required: true },
    trackingCode: { type: String, required: true },
    codAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: { type: String, default: "Booked" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

CourierBookingSchema.index({ orderNumber: 1 });
CourierBookingSchema.index({ trackingCode: 1 });
CourierBookingSchema.index({ courierName: 1 });

export default mongoose.models.CourierBooking || mongoose.model<ICourierBooking>("CourierBooking", CourierBookingSchema);
