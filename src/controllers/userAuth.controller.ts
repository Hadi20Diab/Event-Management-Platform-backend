import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "name, email and password are required" });

        const existing = await User.findOne({ email }).select("+password");
        if (existing && existing.password) return res.status(409).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);

        let user;
        if (existing) {
            existing.password = hashed;
            await existing.save();
            user = existing;
        } else {
            user = await User.create({ name, email, password: hashed });
        }

        const token = generateToken(user._id.toString(), "user");
        res.status(201).json({
            message: "Signup successful",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' }
        });
    } catch (error) {
        next(error);
    }
};

export const signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "email and password are required" });

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id.toString(), "user");
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' }
        });
    } catch (error) {
        next(error);
    }
};
