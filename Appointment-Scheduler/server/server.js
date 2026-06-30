import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Error Middleware
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Uploaded Files
app.use("/uploads", express.static("uploads"));

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Appointment Scheduler API is Running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`🚀 Server Running Successfully`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log("=====================================");
});
