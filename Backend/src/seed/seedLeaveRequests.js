import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import LeaveRequest from "../models/LeaveRequest.js";

dotenv.config();
await connectDB();

// ==============================
// Helpers
// ==============================

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const STATUSES = ["Pending", "Approved", "Rejected"];
const TYPES = ["Medical", "Personal", "Academic"];

const runSeed = async () => {
  try {
    console.log("Seeding leave requests...");

    const students = await User.find({ role: "STUDENT" });
    if (!students.length) {
      console.log("No students found. Seed users first.");
      process.exit(1);
    }

    // Optional: clear old leaves
    await LeaveRequest.deleteMany();

    let totalCreated = 0;

    for (const student of students) {
      const leaveCount = Math.floor(Math.random() * 6) + 4; // 4–9 leaves per student

      for (let i = 0; i < leaveCount; i++) {
        const start = randomDate(
          new Date("2025-06-01"),
          new Date("2026-03-01")
        );

        const end = new Date(start);
        end.setDate(end.getDate() + Math.floor(Math.random() * 3) + 1);

        const status =
          STATUSES[Math.floor(Math.random() * STATUSES.length)];

        const decidedAt =
          status === "Pending"
            ? null
            : new Date(start.getTime() + 86400000); // next day

        await LeaveRequest.create({
          studentId: student._id,
          facultyId: student.assignedFaculty,
          leaveType: TYPES[Math.floor(Math.random() * TYPES.length)],
          fromDate: start,
          toDate: end,
          reason: "Auto-generated demo data",
          status,
          decidedAt,
          facultyRemark:
            status === "Pending"
              ? null
              : "Reviewed during seed generation"
        });

        totalCreated++;
      }
    }

    console.log(`Seed complete. ${totalCreated} leave requests created.`);
    process.exit();
  } catch (error) {
    console.error("Leave seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
