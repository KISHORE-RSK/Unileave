import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import {
  applyLeave,
  getMyLeaves
} from "../controllers/student.controller.js";

const router = express.Router();

router.use(authenticate, allowRoles("STUDENT"));
router.post("/leaves", applyLeave);
router.get("/leaves", getMyLeaves);

export default router;
