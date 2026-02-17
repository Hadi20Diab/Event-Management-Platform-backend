import { Router } from "express";
import {
  getDashboardStats,
  getAdminStats,
  getUserStats,
  getUserDashboardStats
} from "../controllers/dashboard.controller";
import { protect, adminOnly, superAdminOnly } from "../middlewares/auth.middleware";
import { authenticate } from "../middlewares/userAuth.middleware";

const router = Router();

// Dashboard overview stats (admin and super admin only)
router.get("/stats", protect, adminOnly, getDashboardStats);

// Admin-specific statistics (super admin only)
router.get("/admin-stats", protect, superAdminOnly, getAdminStats);

// User statistics (admin only)
router.get("/user-stats", protect, adminOnly, getUserStats);

// User's own dashboard stats (authenticated users)
router.get("/my-stats", authenticate, getUserDashboardStats);

export default router;