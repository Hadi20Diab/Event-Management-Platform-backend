import { Router, Request, Response, NextFunction } from "express";
import { 	registerUserForEvent,
	getRegistrationsByUser,
	getRegistrationById,
	cancelRegistration,
} from "../controllers/registration.controller";
import {
	authenticate,
	authorizeSelfOrAdmin,
} from "../middlewares/userAuth.middleware";

const router = Router();

router.post("/", authenticate, registerUserForEvent);
router.get(
	"/user/:id",
	authenticate,
	authorizeSelfOrAdmin,
	getRegistrationsByUser,
);
router.get("/:id", authenticate, getRegistrationById);
router.delete("/:id", authenticate, cancelRegistration);

export default router;
