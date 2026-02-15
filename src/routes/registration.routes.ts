import { Router, Request, Response, NextFunction } from "express";
import { registerUserForEvent, getRegistrationsByUser, getRegistrationById, cancelRegistration  } from "../controllers/registration.controller";
import { authenticate, authorizeSelfOrAdmin } from "../middlewares/userAuth.middleware";
import Registration from "../models/registration.model";
import { Types } from "mongoose";

const router = Router();

const ownerOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const regId = String(req.params.id || "");
		if (!Types.ObjectId.isValid(regId)) return res.status(400).json({ message: "Invalid registration id" });

		const reg = await Registration.findById(regId);
		if (!reg) return res.status(404).json({ message: "Registration not found" });

		const auth = (req as any).auth;
		if (!auth) return res.status(401).json({ message: "Not authorized" });

		if (auth.role === "admin" || auth.role === "superAdmin") return next();

		if (String(reg.user) === auth.id) return next();

		return res.status(403).json({ message: "Access denied" });
	} catch (err) {
		next(err);
	}
};

router.post("/", authenticate, authorizeSelfOrAdmin, registerUserForEvent);
router.get("/user/:id", authenticate, authorizeSelfOrAdmin, getRegistrationsByUser);
router.get("/:id", authenticate, ownerOrAdmin, getRegistrationById);
router.delete("/:id", authenticate, ownerOrAdmin, cancelRegistration);

export default router;
