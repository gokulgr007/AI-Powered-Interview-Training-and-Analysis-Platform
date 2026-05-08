import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pistonRoutes from "./routes/pistonRoutes.js";

dotenv.config();

const app = express();
// Make mongoose fail fast when DB is unreachable and avoid buffering operations
import mongoosePkg from 'mongoose';
const { set } = mongoosePkg;
set('strictQuery', false);
set('bufferCommands', false);
// Allow the frontend origin and credentials so fetch(..., { credentials: 'include' }) works
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// In development allow any origin for easier testing; in production lock to FRONTEND_ORIGIN
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: FRONTEND_ORIGIN, credentials: true }
  : { origin: true, credentials: true };
app.use(cors(corsOptions));
// Allow larger JSON payloads (avatars as data URLs) — 10mb should be sufficient for images
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '10mb' }));

// Connect to MongoDB and only start the HTTP server after successful connection.
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // fail quickly if Atlas / Mongo not reachable
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // Exit so process managers (or developer) can see the failure and restart when config/network fixed
    process.exit(1);
  }
}

start();

// Log incoming user API requests to help debug ATS score updates
app.use('/api/user', (req, res, next) => {
  try {
    console.log('[user] %s %s body=%o from %s', req.method, req.originalUrl, req.body, req.ip);
  } catch (e) {}
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/piston", pistonRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

// lightweight request logging for score routes to help debug missing POSTs
app.use('/api/score', (req, res, next) => {
  console.log('[score] %s %s from %s', req.method, req.originalUrl, req.ip);
  next();
});

// NOTE: server is started from the `start()` function after DB connect
