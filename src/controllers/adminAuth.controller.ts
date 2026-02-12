import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model";
import { generateToken } from "../utils/jwt";

// REGISTER
export const addNewAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Admin registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id.toString(), admin.role);

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
};
