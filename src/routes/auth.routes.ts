import { Router } from "express";
import { addNewAdmin, adminLogin } from "../controllers/adminAuth.controller";
import { signupUser, signinUser } from "../controllers/userAuth.controller";

const router = Router();

// User auth
router.post("/user/signup", signupUser);
router.post("/user/signin", signinUser);
// Admin login alias
router.post("/admin/login", adminLogin);
router.post("/admin/register", addNewAdmin);

export default router;
