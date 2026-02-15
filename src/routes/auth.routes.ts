import { Router } from "express";
import { addNewAdmin, adminLogin, hashPassword } from "../controllers/adminAuth.controller";
import { authenticate, superAdminOnly } from "../middlewares/auth.middleware";
import { signupUser, signinUser } from "../controllers/userAuth.controller";

const router = Router();

// User auth
router.post("/user/signup", signupUser);
router.post("/user/signin", signinUser);
// Admin login alias
router.post("/admin/login", adminLogin);
router.post("/admin/register", authenticate, superAdminOnly, addNewAdmin);
// Public helper to get bcrypt hash (testing only)
router.post("/hash-password", hashPassword);

export default router;
