import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin.model";

export const createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json(admin);
    } catch (error) {
        next(error);
    }
};

export const getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.json(admin);
    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(admin);
    } catch (error) {
        next(error);
    }
};

export const deleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
