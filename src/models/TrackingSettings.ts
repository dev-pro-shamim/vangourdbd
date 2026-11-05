import mongoose, { Schema, Document } from "mongoose";

export interface ITrackingSettings extends Document {
  metaPixel: {
    isEnabled: boolean;
    pixelId: string;
    capiToken: string;
    testEventCode?: string;
    enabledEvents: {
      pageView: boolean;
      viewContent: boolean;
      search: boolean;
      addToCart: boolean;
      initiateCheckout: boolean;
      purchase: boolean;
    };
  };
  gtm: {
    isEnabled: boolean;
    containerId: string;
    trackEcommerce: boolean;
  };
}

const TrackingSettingsSchema = new Schema<ITrackingSettings>(
  {
    metaPixel: {
      isEnabled: { type: Boolean, default: false },
      pixelId: { type: String, default: "" },
      capiToken: { type: String, default: "" },
      testEventCode: { type: String, default: "" },
      enabledEvents: {
        pageView: { type: Boolean, default: true },
        viewContent: { type: Boolean, default: true },
        search: { type: Boolean, default: true },
        addToCart: { type: Boolean, default: true },
        initiateCheckout: { type: Boolean, default: true },
        purchase: { type: Boolean, default: true },
      },
    },
    gtm: {
      isEnabled: { type: Boolean, default: false },
      containerId: { type: String, default: "" },
      trackEcommerce: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.TrackingSettings || mongoose.model<ITrackingSettings>("TrackingSettings", TrackingSettingsSchema);
