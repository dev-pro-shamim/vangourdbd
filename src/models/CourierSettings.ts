import mongoose, { Schema, Document } from "mongoose";

export interface ICourierSettings extends Document {
  steadfast: {
    enabled: boolean;
    apiKey: string;
    secretKey: string;
    baseUrl: string;
  };
  pathao: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    storeId: string;
    baseUrl: string;
  };
  redx: {
    enabled: boolean;
    apiKey: string;
    baseUrl: string;
  };
  defaultCourier: string;
  senderInfo: {
    name: string;
    phone: string;
    address: string;
  };
}

const CourierSettingsSchema = new Schema<ICourierSettings>(
  {
    steadfast: {
      enabled: { type: Boolean, default: true },
      apiKey: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      baseUrl: { type: String, default: "https://portal.steadfast.com.bd/api/v1" },
    },
    pathao: {
      enabled: { type: Boolean, default: false },
      clientId: { type: String, default: "" },
      clientSecret: { type: String, default: "" },
      username: { type: String, default: "" },
      password: { type: String, default: "" },
      storeId: { type: String, default: "" },
      baseUrl: { type: String, default: "https://courier.pathao.com/api/v1" },
    },
    redx: {
      enabled: { type: Boolean, default: false },
      apiKey: { type: String, default: "" },
      baseUrl: { type: String, default: "https://openapi.redx.com.bd/v1.0.0-beta" },
    },
    defaultCourier: { type: String, default: "Steadfast" },
    senderInfo: {
      name: { type: String, default: "VANGUARD BD" },
      phone: { type: String, default: "01700000000" },
      address: { type: String, default: "Dhaka, Bangladesh" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.CourierSettings || mongoose.model<ICourierSettings>("CourierSettings", CourierSettingsSchema);
