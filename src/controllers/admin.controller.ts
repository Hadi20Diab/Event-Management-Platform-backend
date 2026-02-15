import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { query } from "express-validator";

import Admin from "../models/admin.model";

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      message: `${admin.name} account created successfully!`,
      admin,
    });
    console.log("New admin is created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      sort = "createdAt",
      order = "desc",
      ...filters
    } = req.query as Record<string, string>;

    // Allowed filter fields
    const allowedFilters = ["role", "email", "name"];

    const query = Object.keys(filters)
      .filter((key) => allowedFilters.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = filters[key];
        return obj;
      }, {});

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting
    const sortOption: any = {
      [sort]: order === "asc" ? 1 : -1,
    };

    // Execute query
    const admins = await Admin.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Admin.countDocuments(query);

    res.json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      results: admins,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.json({
      message: `This is ${admin.name} account.`,
      admin,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updates: any = { ...req.body };

    // Prevent role changes via this endpoint — role can only be changed
    // through the superAdmin-only role-update endpoint.
    if (typeof updates.role !== 'undefined') {
      return res.status(403).json({ message: 'Role cannot be changed via this endpoint' });
    }

    if (typeof updates.password !== 'undefined') {
      if (!updates.password || typeof updates.password !== 'string' || !updates.password.startsWith('$2')) {
        return res.status(400).json({ message: 'Password must be a bcrypt hash' });
      }
      // Store the provided bcrypt hash as-is (client-side hashing flow)
      updates.password = updates.password;
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: `${admin.name} account updated successfully!`, admin });
  } catch (error) {
    next(error);
  }
};

export const updateAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["admin", "superAdmin"];
    if (!role || typeof role !== "string" || !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.role = role as "admin" | "superAdmin";
    await admin.save();

    res.json({ message: `${admin.name} role updated to ${role}`, admin });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin is deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
