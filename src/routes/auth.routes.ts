import { Router } from "express";
import { register, login } from "../controllers/adminAuth.controller";
import { signupUser, signinUser } from "../controllers/userAuth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// User auth
router.post("/user/signup", signupUser);
router.post("/user/signin", signinUser);
// Admin signin alias
router.post("/admin/signin", login);

export default router;
