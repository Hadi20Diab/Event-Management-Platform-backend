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

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Password is required" });
    }

    // ONLY accept SHA256 hash (64 hex characters)
    if (!/^[a-f0-9]{64}$/i.test(password)) {
      return res.status(400).json({ message: 'Password must be a SHA256 hash (64 hex characters). Use /api/auth/hash-password to generate one for testing.' });
    }

    // Bcrypt the SHA256 hash for secure storage
    const passwordToStore = await bcrypt.hash(password, 10);

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

    if (!email || !password || typeof password !== 'string') {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // ONLY accept SHA256 hash (64 hex characters)
    if (!/^[a-f0-9]{64}$/i.test(password)) {
      return res.status(400).json({ message: 'Password must be a SHA256 hash (64 hex characters). Use /api/auth/hash-password to generate one for testing.' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(400).json({ message: 'Admin Not Found' });
    }

    if (!admin.password) {
      return res.status(400).json({ message: 'No password set for this admin; contact superAdmin' });
    }

    // Compare SHA256 hash with bcrypted stored hash
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id.toString(), admin.role);

    // Set httpOnly cookie for security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
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
