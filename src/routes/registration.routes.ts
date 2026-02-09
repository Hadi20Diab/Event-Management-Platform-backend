import { Router } from "express";
import { registerUserForEvent, getRegistrationsByUser } from "../controllers/registration.controller";

const router = Router();

router.post("/", registerUserForEvent);
router.get("/user/:id", getRegistrationsByUser);

export default router;
