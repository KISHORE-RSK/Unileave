import LeaveRequest from "../models/LeaveRequest.js";


export const applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason, attachmentUrl } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        message: "From date cannot be after To date"
      });
    }

    if (!req.user.assignedFaculty) {
      return res.status(400).json({
        message: "No faculty assigned to this student"
      });
    }

    const leave = await LeaveRequest.create({
      studentId: req.user._id,
      facultyId: req.user.assignedFaculty,
      leaveType,
      fromDate,
      toDate,
      reason,
      attachmentUrl,
      status: "Pending"
    });

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave
    });
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({
      message: "Failed to submit leave request"
    });
  }
};


export const getMyLeaves = async (req, res) => {
  const leaves = await LeaveRequest.find({
    studentId: req.user._id
  })
    .sort({ createdAt: -1 })
    .limit(10);

  const stats = {
    Pending: 0,
    Approved: 0,
    Rejected: 0
  };

  leaves.forEach((leave) => {
    stats[leave.status]++;
  });

  res.json({
    leaves,
    stats
  });
};
