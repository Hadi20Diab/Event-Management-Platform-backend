import { Router } from "express";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user.controller";
import { authenticate, authorizeAdmin, authorizeSelfOrAdmin } from "../middlewares/userAuth.middleware";

const router = Router();

router.get("/", authenticate, authorizeAdmin, getUsers);
router.get("/:id", authenticate, authorizeSelfOrAdmin, getUserById);
router.put("/:id", authenticate, authorizeSelfOrAdmin, updateUser);
router.delete("/:id", authenticate, authorizeSelfOrAdmin, deleteUser);

export default router;
