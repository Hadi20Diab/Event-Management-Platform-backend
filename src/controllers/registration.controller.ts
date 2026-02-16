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
        const userId = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (!Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid user id" });

        // Get query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortField = req.query.sort as string || 'createdAt';
        const sortOrder = req.query.order as string === 'desc' ? -1 : 1;
        const status = req.query.status as string;

        // Build filter object
        const filter: any = { user: userId };
        if (status) {
            filter.status = status;
        }

        // Build sort object
        const sort: any = {};
        sort[sortField] = sortOrder;

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination metadata
        const totalCount = await Registration.countDocuments(filter);

        // Execute query with pagination, filtering and sorting
        const registrations = await Registration.find(filter)
            .populate("event")
            .populate("user")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Return response with pagination metadata
        res.json({
            data: registrations,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNext: page < Math.ceil(totalCount / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getRegistrationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regId = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (!Types.ObjectId.isValid(regId)) return res.status(400).json({ message: "Invalid registration id" });

        const reg = await Registration.findById(regId).populate("event").populate("user");
        if (!reg) return res.status(404).json({ message: "Registration not found" });
        res.json(reg);
    } catch (error) {
        next(error);
    }
};

export const cancelRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regId = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (!Types.ObjectId.isValid(regId)) return res.status(400).json({ message: "Invalid registration id" });

        const reg = await Registration.findByIdAndDelete(regId);
        if (!reg) return res.status(404).json({ message: "Registration not found" });
        
        res.json({ message: "Registration cancelled successfully" });
    } catch (error) {
        next(error);
    }
};