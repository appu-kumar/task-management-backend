import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/User.js";

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role === "admin") {
        console.log(`Admin already exists: ${email}`);
      } else {
        existing.role = "admin";
        await existing.save();
        console.log(`Promoted existing user to admin: ${email}`);
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await User.create({
        name: ADMIN_NAME,
        email,
        password: hashedPassword,
        role: "admin",
        status: "active",
      });

      console.log("Admin user created successfully");
      console.log(`  Email:    ${email}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
