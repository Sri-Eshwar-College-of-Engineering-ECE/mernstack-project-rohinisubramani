import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

// Load Environment Variables
dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@schedulify.com";
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("Admin user already exists: " + email);
      process.exit(0);
    }

    await User.create({
      name: "Dr. Admin",
      email: email,
      password: "adminpassword",
      phone: "1234567890",
      role: "admin",
    });

    console.log("Admin user seeded successfully: " + email);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
