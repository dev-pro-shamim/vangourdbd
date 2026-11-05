import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
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
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  storeBranding: {
    name: string;
    logoUrl?: string;
    phone: string;
    email: string;
    address: string;
  };
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true },
    orderId: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    items: { type: [Schema.Types.Mixed], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    paymentStatus: { type: String, default: "Pending" },
    storeBranding: {
      name: { type: String, default: "VANGUARD BD" },
      logoUrl: { type: String, default: "" },
      phone: { type: String, default: "01700000000" },
      email: { type: String, default: "support@vanguardbd.com" },
      address: { type: String, default: "Dhaka, Bangladesh" },
    },
  },
  { timestamps: true }
);

InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ orderNumber: 1 });

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
