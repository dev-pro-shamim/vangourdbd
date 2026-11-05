import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cmsRoutes from "./routes/cmsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
connectDB();

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "VANGUARD / CommandoBD CMS API",
    timestamp: new Date().toISOString(),
  });
});

// CMS API Routes
app.use("/api", cmsRoutes);

app.listen(PORT, () => {
  console.log(`[Express Backend] CMS Server running on http://localhost:${PORT}`);
});

export default app;
