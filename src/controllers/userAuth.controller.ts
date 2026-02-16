import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        // ONLY accept SHA256 hash (64 hex characters)
        if (!/^[a-f0-9]{64}$/i.test(password)) {
            return res.status(400).json({ message: 'Password must be a SHA256 hash (64 hex characters). Use /api/auth/hash-password to generate one for testing.' });
        }

        const existing = await User.findOne({ email }).select('+password');
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Bcrypt the SHA256 hash for secure storage
        const passwordToStore = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: passwordToStore });

        const token = generateToken(user._id.toString(), "user");
        
        // Set httpOnly cookie for security
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "Signup successful",
            user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' }
        });
    } catch (error) {
        next(error);
    }
};

export const signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'email and password are required' });
        }

        // ONLY accept SHA256 hash (64 hex characters)
        if (!/^[a-f0-9]{64}$/i.test(password)) {
            return res.status(400).json({ message: 'Password must be a SHA256 hash (64 hex characters). Use /api/auth/hash-password to generate one for testing.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'User not found' });
        if (!user.password) return res.status(400).json({ message: 'No password set for this account; contact support' });

        // Compare SHA256 hash with bcrypted stored hash
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id.toString(), 'user');
        
        // Set httpOnly cookie for security
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' }
        });
    } catch (error) {
        next(error);
    }
};
