import LeaveRequest from "../models/LeaveRequest.js";

export const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch recent requests (all statuses)
    const leaves = await LeaveRequest.find({
      facultyId
    })
      .populate("studentId", "name class")
      .sort({ createdAt: -1 })
      .limit(15);

    // Pending count
    const pendingCount = await LeaveRequest.countDocuments({
      facultyId,
      status: "Pending"
    });

    // Approved today
    const approvedToday = await LeaveRequest.countDocuments({
      facultyId,
      status: "Approved",
      decidedAt: { $gte: todayStart, $lte: todayEnd }
    });

    // Rejected today
    const rejectedToday = await LeaveRequest.countDocuments({
      facultyId,
      status: "Rejected",
      decidedAt: { $gte: todayStart, $lte: todayEnd }
    });

    res.json({
      stats: {
        pending: pendingCount,
        approvedToday,
        rejectedToday
      },
      leaves
    });
  } catch (error) {
    console.error("Faculty dashboard error:", error);
    res.status(500).json({
      message: "Failed to load faculty dashboard"
    });
  }
};


export const decideLeave = async (req, res) => {
  try {
    const { status, remark } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected"
      });
    }

    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      facultyId: req.user._id
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Leave request already decided"
      });
    }

    leave.status = status;
    leave.facultyRemark = remark || null;
    leave.decidedAt = new Date();

    await leave.save();

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave
    });
  } catch (error) {
    console.error("Decide leave error:", error);
    res.status(500).json({
      message: "Failed to update leave status"
    });
  }
};
