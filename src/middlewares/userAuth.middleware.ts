import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { Types } from "mongoose";

interface TokenPayload {
    id: string;
    role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = auth.split(" ")[1];
        const payload = verifyToken(token) as TokenPayload | null;
        if (!payload || !payload.id) return res.status(401).json({ message: "Invalid token" });
        if (!Types.ObjectId.isValid(payload.id)) return res.status(401).json({ message: "Invalid token id" });

        (req as any).auth = { id: payload.id, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth;
    if (!auth || (auth.role !== "admin" && auth.role !== "superAdmin")) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

export const authorizeSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth;
    const targetId = String(req.params.id || req.body.userId || "");
    if (!auth) return res.status(401).json({ message: "Not authorized" });
    if (auth.id === targetId) return next();
    if (auth.role === "admin" || auth.role === "superAdmin") return next();
    return res.status(403).json({ message: "Access denied" });
};

export default { authenticate, authorizeAdmin, authorizeSelfOrAdmin };
