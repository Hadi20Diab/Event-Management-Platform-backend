import { Request, Response, NextFunction } from "express";
import Registration from "../models/registration.model";
import User from "../models/user.model";
import Event from "../models/event.model";
import { Types } from "mongoose";

export const registerUserForEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, eventId } = req.body;
        if (!userId || !eventId) {
            return res.status(400).json({ message: "userId and eventId are required" });
        }

        // Validate existence
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Prevent duplicate registration
        const existing = await Registration.findOne({ user: userId, event: eventId });
        if (existing) return res.status(409).json({ message: "User already registered for this event" });

        const registration = await Registration.create({ user: userId, event: eventId });
        res.status(201).json(registration);
    } catch (error) {
        next(error);
    }
};

export const getRegistrationsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid user id" });

        const regs = await Registration.find({ user: userId }).populate("event").populate("user");
        res.json(regs);
    } catch (error) {
        next(error);
    }
};
