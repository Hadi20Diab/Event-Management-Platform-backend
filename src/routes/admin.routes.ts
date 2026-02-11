import { Router } from "express";
import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller";
import validate from "../middlewares/adminValidate.middleware";
import {
  createAdminValidator,
  updateAdminValidator,
  idValidator,
} from "../validators/admin.validator";

const router = Router();

router.post("/", createAdminValidator, validate, createAdmin);
router.get("/", getAdmins);
router.get("/:id", idValidator, validate, getAdminById);
router.put("/:id", updateAdminValidator, validate, updateAdmin);
router.delete("/:id", idValidator, validate, deleteAdmin);

export default router;
