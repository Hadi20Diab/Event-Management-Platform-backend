import { Router } from "express";
import { registerUserForEvent, getRegistrationsByUser, getRegistrationById, cancelRegistration  } from "../controllers/registration.controller";

const router = Router();

router.post("/", registerUserForEvent);
router.get("/user/:id", getRegistrationsByUser);
router.get("/:id", getRegistrationById);
router.delete("/:id", cancelRegistration);

export default router;
