
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const connectDB = require("./config/db");

(async () => {
  await connectDB();
  const existing = await User.findOne({ email: "admin@hospital.com" });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }
  await User.create({
    name: "Admin",
    email: "admin@hospital.com",
    password: "admin123",
    role: "admin",
  });
  console.log("✅ Admin created — email: admin@hospital.com  password: admin123");
  process.exit(0);
})();