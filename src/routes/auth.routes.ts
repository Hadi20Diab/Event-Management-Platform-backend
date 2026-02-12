import { Router } from "express";
import { addNewAdmin, adminLogin } from "../controllers/adminAuth.controller";
import { protect, superAdminOnly } from "../middlewares/auth.middleware";
import { signupUser, signinUser } from "../controllers/userAuth.controller";

const router = Router();

// User auth
router.post("/user/signup", signupUser);
router.post("/user/signin", signinUser);
// Admin login alias
router.post("/admin/login", adminLogin);
router.post("/admin/register", protect, superAdminOnly, addNewAdmin);

export default router;
