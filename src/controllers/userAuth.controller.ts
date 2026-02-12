import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password || typeof password !== 'string' || !password.startsWith('$2')) {
            return res.status(400).json({ message: 'name, email and bcrypt-hashed password are required' });
        }

        const existing = await User.findOne({ email }).select('+password');
        if (existing && existing.password) {
            // If existing user already has a bcrypt password, treat as conflict
            if (existing.password.startsWith('$2')) return res.status(409).json({ message: 'Email already registered' });
            // Existing user has legacy plaintext password — reject and prompt migration
            return res.status(400).json({ message: 'Existing account uses legacy plaintext password; please re-register or contact support' });
        }

        const passwordToStore = password;

        let user;
        if (existing) {
            existing.password = passwordToStore;
            await existing.save();
            user = existing;
        } else {
            user = await User.create({ name, email, password: passwordToStore });
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
        if (!email || !password || typeof password !== 'string' || !password.startsWith('$2')) {
            return res.status(400).json({ message: 'email and bcrypt-hashed password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.password.startsWith('$2')) {
            return res.status(400).json({ message: 'Account uses legacy plaintext password; please re-register or contact support' });
        }

        if (password !== user.password) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id.toString(), 'user');
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' }
        });
    } catch (error) {
        next(error);
    }
};
