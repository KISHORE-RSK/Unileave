import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

await connectDB();

const CLASSES = ["CSE-6A", "CSE-6B", "CSE-6C"];

const runSeed = async () => {
  try {
    console.log("Clearing old users...");
    await User.deleteMany();

    // =====================
    // ADMIN / HOD
    // =====================
    const admin = await User.create({
      name: "Dr. Rao",
      email: "hod@college.edu",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      department: "CSE"
    });

    console.log("Admin created");

    // =====================
    // FACULTY
    // =====================
    const faculties = [];

    for (let i = 1; i <= 5; i++) {
      const faculty = await User.create({
        name: `Faculty ${i}`,
        email: `faculty${i}@college.edu`,
        passwordHash: await bcrypt.hash("faculty123", 10),
        role: "FACULTY",
        department: "CSE"
      });

      faculties.push(faculty);
    }

    console.log("5 faculties created");

    // =====================
    // STUDENTS
    // =====================
    let facultyIndex = 0;
    const students = [];

    for (const className of CLASSES) {
      for (let i = 1; i <= 20; i++) {
        const assignedFaculty =
          faculties[facultyIndex % faculties.length];

        const student = await User.create({
          name: `${className} Student ${i}`,
          email: `${className.toLowerCase()}_${i}@college.edu`,
          passwordHash: await bcrypt.hash("student123", 10),
          role: "STUDENT",
          class: className,
          department: "CSE",
          assignedFaculty: assignedFaculty._id
        });

        students.push(student);
        facultyIndex++;
      }
    }

    console.log("60 students created across 3 classes");

    console.log("Department users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
