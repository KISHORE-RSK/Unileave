import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    leaveType: {
      type: String,
      enum: ["Medical", "Personal", "Academic"],
      required: true
    },

    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    reason: { type: String, required: true },
    attachmentUrl: String,

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    facultyRemark: String,
    decidedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);
