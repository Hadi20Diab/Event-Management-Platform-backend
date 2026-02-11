import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin.model";

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await Admin.create(req.body);
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
    const admins = await Admin.find();
    res.json(admins);
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
    console.log(`Account is found`);
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
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }
    res.json({
      message: `${admin.name} account updated successfully!`,
      admin,
    });
    console.log("Admin is updated successfully!");
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
    await Admin.findByIdAndDelete(req.params.id);
    res.status(204).send().json({
      message: `Admin is deleted successfully!`,
    });
    console.log("Admin is deleted successfully!");
  } catch (error) {
    next(error);
  }
};
