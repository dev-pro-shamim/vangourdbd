import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

SupplierSchema.index({ name: 1 });
SupplierSchema.index({ phone: 1 });

export default mongoose.models.Supplier || mongoose.model<ISupplier>("Supplier", SupplierSchema);
