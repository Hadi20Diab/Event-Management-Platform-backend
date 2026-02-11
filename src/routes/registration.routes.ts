import { Router } from "express";
import { registerUserForEvent, getRegistrationsByUser, cancelRegistration  } from "../controllers/registration.controller";

const router = Router();

router.post("/", registerUserForEvent);
router.get("/user/:id", getRegistrationsByUser);
router.delete("/:id", cancelRegistration);

export default router;
