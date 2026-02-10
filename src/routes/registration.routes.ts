import { Router } from "express";
import { registerUserForEvent, getRegistrationsByUser, getRegistrationById } from "../controllers/registration.controller";

const router = Router();

router.post("/", registerUserForEvent);
router.get("/user/:id", getRegistrationsByUser);
router.get("/:id", getRegistrationById);

export default router;
