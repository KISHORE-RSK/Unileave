import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalRequests = await LeaveRequest.countDocuments();

    const approvedCount = await LeaveRequest.countDocuments({
      status: "Approved"
    });

    const rejectedCount = await LeaveRequest.countDocuments({
      status: "Rejected"
    });

    const approvalRate =
      totalRequests === 0
        ? 0
        : Math.round((approvedCount / totalRequests) * 100);

    // Faculty-wise aggregation
    const facultyStats = await LeaveRequest.aggregate([
      {
        $match: {
          status: { $in: ["Approved", "Rejected"] }
        }
      },
      {
        $group: {
          _id: "$facultyId",
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Approved"] }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },
      {
        $project: {
          facultyName: "$faculty.name",
          approved: 1,
          rejected: 1,
          total: 1
        }
      }
    ]);

    // Peak leave month
    const peakPeriod = await LeaveRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$fromDate" },
            month: { $month: "$fromDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const peakLeavePeriod =
      peakPeriod.length > 0
        ? `${peakPeriod[0]._id.month}-${peakPeriod[0]._id.year}`
        : "N/A";

    res.json({
      stats: {
        totalRequests,
        approvalRate,
        peakLeavePeriod
      },
      facultyStats
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      message: "Failed to load admin dashboard"
    });
  }
};
export const getMonthlyLeaveAnalytics = async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    if (!year) {
      return res.status(400).json({
        message: "Year query param is required"
      });
    }

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    const result = await LeaveRequest.aggregate([
      {
        $match: {
          fromDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$fromDate" }
          },
          total: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Approved"] }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const months = monthNames.map((name, idx) => {
      const found = result.find(r => r._id.month === idx + 1);

      return {
        month: name,
        monthIndex: idx + 1,
        total: found?.total || 0,
        approved: found?.approved || 0,
        rejected: found?.rejected || 0
      };
    });

    res.json({
      year,
      months
    });
  } catch (error) {
    console.error("Monthly analytics error:", error);
    res.status(500).json({
      message: "Failed to load monthly analytics"
    });
  }
};
export const getFacultyAnalytics = async (req, res) => {
  try {
    const classFilter = req.query.class;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" }
    ];

    if (classFilter) {
      pipeline.push({
        $match: {
          "student.class": classFilter
        }
      });
    }

    pipeline.push(
      {
        $group: {
          _id: "$facultyId",
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },
      {
        $project: {
          facultyId: "$_id",
          facultyName: "$faculty.name",
          approved: 1,
          rejected: 1,
          pending: 1,
          total: 1
        }
      },
      { $sort: { total: -1 } }
    );

    const facultyStats = await LeaveRequest.aggregate(pipeline);

    const totalFaculty = facultyStats.length;

    const totalDecisions = facultyStats.reduce(
      (sum, f) => sum + f.approved + f.rejected,
      0
    );

    const totalApproved = facultyStats.reduce(
      (sum, f) => sum + f.approved,
      0
    );

    const approvalRate =
      totalDecisions === 0
        ? 0
        : Math.round((totalApproved / totalDecisions) * 100);

    res.json({
      summary: {
        totalFaculty,
        totalDecisions,
        approvalRate
      },
      facultyStats
    });
  } catch (error) {
    console.error("Faculty analytics error:", error);
    res.status(500).json({
      message: "Failed to load faculty analytics"
    });
  }
};