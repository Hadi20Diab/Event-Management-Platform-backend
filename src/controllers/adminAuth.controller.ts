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

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!password) missingFields.push("password");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Require the frontend to send a bcrypt hash (starts with "$2").
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Password is required and must be a bcrypt hash" });
    }

    // bcrypt hashes begin with $2a, $2b, $2y, etc. Enforce this format.
    if (!password.startsWith('$2')) {
      return res.status(400).json({ message: "Password must be a bcrypt hash" });
    }

    const passwordToStore = password;

    const admin = await Admin.create({
      name,
      email,
      phone,
      password: passwordToStore,
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

    if (!email || !password || typeof password !== 'string' || !password.startsWith('$2')) {
      return res.status(400).json({ message: 'email and bcrypt-hashed password are required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(400).json({ message: 'Admin Not Found' });
    }

    if (!admin.password) {
      return res.status(400).json({ message: 'No password set for this admin; contact superAdmin' });
    }

    // If stored password is legacy plaintext, reject and ask for migration.
    if (!admin.password.startsWith('$2')) {
      return res.status(400).json({ message: 'Admin account uses legacy plaintext password; contact superAdmin to reset' });
    }

    // Both provided and stored passwords are bcrypt hashes — compare directly.
    if (password !== admin.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id.toString(), admin.role);

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: return bcrypt hash for a given plaintext password (testing helper)
export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== 'string') return res.status(400).json({ message: 'password is required' });
    const hash = await bcrypt.hash(password, 10);
    res.json({ hash });
  } catch (error) {
    next(error);
  }
};
