import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user.controller";
import { authenticate, authorizeAdmin, authorizeSelfOrAdmin } from "../middlewares/userAuth.middleware";
import { signupUser } from "../controllers/userAuth.controller";

const router = Router();

// Create user: if request has Authorization header -> must be admin; otherwise public signup
router.post("/", (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // public signup
        return signupUser(req, res, next);
    }

    // authenticated path -> require admin
    authenticate(req, res, (err?: any) => {
        if (err) return next(err);
        authorizeAdmin(req, res, (err2?: any) => {
            if (err2) return next(err2);
            return createUser(req, res, next);
        });
    });
});
router.get("/", authenticate, authorizeAdmin, getUsers);
router.get("/:id", authenticate, authorizeSelfOrAdmin, getUserById);
router.put("/:id", authenticate, authorizeSelfOrAdmin, updateUser);
router.delete("/:id", authenticate, authorizeSelfOrAdmin, deleteUser);

export default router;
