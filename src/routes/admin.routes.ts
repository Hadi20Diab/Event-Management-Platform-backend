import { Router } from "express";
import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/admin.controller";
import validate from "../middlewares/validateRequest";
import {
  createAdminValidator,
  updateAdminValidator,
  idValidator,
} from "../validators/admin.validator";
import { protect, adminOnly, superAdminOnly, selfOrSuperAdmin, selfOnly } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  protect,
  adminOnly,
  createAdminValidator,
  validate,
  createAdmin,
);

router.get("/", protect, superAdminOnly, getAdmins);

router.get("/:id", protect, selfOrSuperAdmin, idValidator, validate, getAdminById);

router.put(
  "/:id",
  protect,
  selfOnly,
  updateAdminValidator,
  validate,
  updateAdmin,
);

// SuperAdmin-only: update role
router.put(
  "/:id/role",
  protect,
  superAdminOnly,
  idValidator,
  validate,
  updateAdminRole,
);

router.delete("/:id", protect, adminOnly, idValidator, validate, deleteAdmin);

export default router;
