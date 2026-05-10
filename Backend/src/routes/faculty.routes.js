import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import {
  getFacultyDashboard,
  decideLeave
} from "../controllers/faculty.controller.js";

const router = express.Router();

router.use(authenticate, allowRoles("FACULTY"));
router.get("/leaves", getFacultyDashboard);
router.patch("/leaves/:id", decideLeave);

export default router;
