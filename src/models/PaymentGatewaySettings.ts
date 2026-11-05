import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentGatewaySettings extends Document {
  bkash: {
    enabled: boolean;
    appKey: string;
    appSecret: string;
    username: string;
    password: string;
    isSandbox: boolean;
    instructions?: string;
  };
  nagad: {
    enabled: boolean;
    merchantId: string;
    publicKey: string;
    privateKey: string;
    isSandbox: boolean;
    instructions?: string;
  };
  rocket: {
    enabled: boolean;
    accountType: string;
    number: string;
    instructions?: string;
  };
  upay: {
    enabled: boolean;
    accountType: string;
    number: string;
    instructions?: string;
  };
  sslcommerz: {
    enabled: boolean;
    storeId: string;
    storePassword: string;
    isSandbox: boolean;
  };
  cod: {
    enabled: boolean;
    extraCharge: number;
    instructions?: string;
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber?: string;
  };
}

const PaymentGatewaySettingsSchema = new Schema<IPaymentGatewaySettings>(
  {
    bkash: {
      enabled: { type: Boolean, default: true },
      appKey: { type: String, default: "" },
      appSecret: { type: String, default: "" },
      username: { type: String, default: "" },
      password: { type: String, default: "" },
      isSandbox: { type: Boolean, default: true },
      instructions: { type: String, default: "Send money or pay via bKash Merchant account." },
    },
    nagad: {
      enabled: { type: Boolean, default: true },
      merchantId: { type: String, default: "" },
      publicKey: { type: String, default: "" },
      privateKey: { type: String, default: "" },
      isSandbox: { type: Boolean, default: true },
      instructions: { type: String, default: "Payment through Nagad checkout." },
    },
    rocket: {
      enabled: { type: Boolean, default: false },
      accountType: { type: String, default: "Personal" },
      number: { type: String, default: "" },
      instructions: { type: String, default: "Send money to Rocket number." },
    },
    upay: {
      enabled: { type: Boolean, default: false },
      accountType: { type: String, default: "Personal" },
      number: { type: String, default: "" },
      instructions: { type: String, default: "Pay using Upay app." },
    },
    sslcommerz: {
      enabled: { type: Boolean, default: false },
      storeId: { type: String, default: "" },
      storePassword: { type: String, default: "" },
      isSandbox: { type: Boolean, default: true },
    },
    cod: {
      enabled: { type: Boolean, default: true },
      extraCharge: { type: Number, default: 0 },
      instructions: { type: String, default: "Pay with cash upon delivery to the courier rider." },
    },
    bankTransfer: {
      enabled: { type: Boolean, default: false },
      bankName: { type: String, default: "" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      branch: { type: String, default: "" },
      routingNumber: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentGatewaySettings || mongoose.model<IPaymentGatewaySettings>("PaymentGatewaySettings", PaymentGatewaySettingsSchema);
