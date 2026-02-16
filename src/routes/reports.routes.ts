import { Router } from "express";
import { getReports } from "../controllers/reports.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/reports - admin only
router.get("/", protect, adminOnly, getReports);

export default router;
