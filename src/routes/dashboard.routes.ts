import { Router } from "express";
import {
  getDashboardStats,
  getAdminStats,
  getUserStats
} from "../controllers/dashboard.controller";
import { protect, adminOnly, superAdminOnly } from "../middlewares/auth.middleware";

const router = Router();

// Dashboard overview stats (admin and super admin only)
router.get("/stats", protect, adminOnly, getDashboardStats);

// Admin-specific statistics (super admin only)
router.get("/admin-stats", protect, superAdminOnly, getAdminStats);

// User statistics (admin only)
router.get("/user-stats", protect, adminOnly, getUserStats);

export default router;