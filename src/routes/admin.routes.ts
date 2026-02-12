import { Router } from "express";
import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller";
import validate from "../middlewares/validateRequest";
import {
  createAdminValidator,
  updateAdminValidator,
  idValidator,
} from "../validators/admin.validator";
import { protect, adminOnly, superAdminOnly, selfOrSuperAdmin } from "../middlewares/auth.middleware";

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
  adminOnly,
  updateAdminValidator,
  validate,
  updateAdmin,
);

router.delete("/:id", protect, adminOnly, idValidator, validate, deleteAdmin);

export default router;
