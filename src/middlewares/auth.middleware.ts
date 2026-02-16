import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model";

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    (req as any).admin = admin;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

// ADMIN ONLY
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin = (req as any).admin;

  if (!admin || (admin.role !== "admin" && admin.role !== "superAdmin")) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

// Super-admin only
export const superAdminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin = (req as any).admin;

  if (!admin || admin.role !== "superAdmin") {
    return res.status(403).json({ message: "Access denied - superAdmin only" });
  }

  next();
};

// Allow the same admin (owner) or a superAdmin
export const selfOrSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin = (req as any).admin;
  const targetId = String(req.params.id || "");

  if (!admin) return res.status(401).json({ message: "Not authorized" });

  // If requester is the target admin
  if (admin._id && String(admin._id) === targetId) return next();

  // Or if requester is a superAdmin
  if (admin.role === "superAdmin") return next();

  return res.status(403).json({ message: "Access denied" });
};

// Allow only the same admin (owner)
export const selfOnly = (req: Request, res: Response, next: NextFunction) => {
  const admin = (req as any).admin;
  const targetId = String(req.params.id || "");

  if (!admin) return res.status(401).json({ message: "Not authorized" });

  if (admin._id && String(admin._id) === targetId) return next();

  return res.status(403).json({ message: "Access denied" });
};
