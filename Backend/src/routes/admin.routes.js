import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getAdminDashboard,getMonthlyLeaveAnalytics,getFacultyAnalytics } from "../controllers/admin.controller.js";


const router = express.Router();

router.use(authenticate, allowRoles("ADMIN"));

router.get("/dashboard", getAdminDashboard);
router.get("/analytics/monthly", getMonthlyLeaveAnalytics);
router.get("/analytics/faculty", getFacultyAnalytics);
export default router;
