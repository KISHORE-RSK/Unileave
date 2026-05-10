import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing users (only for development)
    await User.deleteMany();

    const adminPassword = await hashPassword("admin123");
    const facultyPassword = await hashPassword("faculty123");
    const studentPassword = await hashPassword("student123");

    const admin = await User.create({
      name: "Department Admin",
      email: "admin@college.edu",
      passwordHash: adminPassword,
      role: "ADMIN",
      department: "CSE"
    });

    const faculty = await User.create({
      name: "Dr. Faculty",
      email: "faculty@college.edu",
      passwordHash: facultyPassword,
      role: "FACULTY",
      department: "CSE"
    });

    const student = await User.create({
      name: "Student One",
      email: "student@college.edu",
      passwordHash: studentPassword,
      role: "STUDENT",
      department: "CSE",
      class: "CSE-6A",
      assignedFaculty: faculty._id
    });

    console.log("Users seeded successfully");
    console.log({
      admin: admin.email,
      faculty: faculty.email,
      student: student.email
    });

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
