import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "@/config/db";
import authRoutes from "@/routes/authRoutes";
import progressRoutes from "@/routes/progressRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/progress", progressRoutes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  });
