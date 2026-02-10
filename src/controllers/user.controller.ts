import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Registration from "../models/registration.model";

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove any registrations belonging to this user
        await Registration.deleteMany({ user: deleted._id });

        res.json({ message: "User and related registrations deleted successfully" });
    } catch (error) {
        next(error);
    }
};
