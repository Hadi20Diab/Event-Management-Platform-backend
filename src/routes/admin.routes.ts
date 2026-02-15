import { Router } from "express";
import {
  getAdmins,
  getAdminById,
  updateAdmin,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/admin.controller";
import validate from "../middlewares/validateRequest";
import {
  updateAdminValidator,
  idValidator,
} from "../validators/admin.validator";
import {
  authenticate,
  superAdminOnly,
  authorizeSelfOrSuperAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, superAdminOnly, getAdmins);

router.get(
  "/:id",
  authenticate,
  authorizeSelfOrSuperAdmin,
  idValidator,
  validate,
  getAdminById,
);

router.put(
  "/:id",
  authenticate,
  authorizeSelfOrSuperAdmin,
  updateAdminValidator,
  validate,
  updateAdmin,
);

// SuperAdmin-only: update role
router.put(
  "/:id/role",
  authenticate,
  superAdminOnly,
  idValidator,
  validate,
  updateAdminRole,
);

router.delete(
  "/:id",
  authenticate,
  authorizeSelfOrSuperAdmin,
  idValidator,
  validate,
  deleteAdmin,
);

export default router;
