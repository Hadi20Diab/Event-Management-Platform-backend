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

    // Accept already-hashed password (frontend may send bcrypt hash)
    const passwordToStore = typeof password === 'string' && password.startsWith('$2')
      ? password
      : await bcrypt.hash(password, 10);

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

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(400).json({ message: "Admin Not Found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // legacy case: admin.password stored in DB as plaintext
      if (admin.password === password) {
        // migrate to hashed password
        const hashed = await bcrypt.hash(password, 10);
        admin.password = hashed;
        await admin.save();
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
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
