import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("[Express Backend] No MONGODB_URI set; using dual-mode file store engine (.cms-data).");
    return;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Express Backend] MongoDB Connected: ${uri}`);
  } catch (error) {
    console.warn("[Express Backend] MongoDB connection not available, operating in file-store mode:", (error as Error).message);
  }
}
