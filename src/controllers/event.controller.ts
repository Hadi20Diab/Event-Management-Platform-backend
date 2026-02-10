import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid event data", details: error.errors });
    }
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query;
    const dateQ = q.date as string | undefined;
    const locationQ = q.location as string | undefined;
    const statusQ = q.status as string | undefined;
    const sortQ = q.sort as string | undefined;
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 10));

    const filter: any = {};

    if (dateQ) {
      const d = new Date(dateQ);
      if (!Number.isNaN(d.getTime())) {
        const start = new Date(d);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        filter.date = { $gte: start, $lt: end };
      }
    }

    if (locationQ) filter.location = { $regex: new RegExp(locationQ, "i") };
    if (statusQ) filter.status = statusQ;


    let mongoQuery = Event.find(filter);
    if (sortQ) {
      mongoQuery = mongoQuery.sort(sortQ);
    } else {
      mongoQuery = mongoQuery.sort("-date");
    }

    const skip = (page - 1) * limit;
    mongoQuery = mongoQuery.skip(skip).limit(limit);

    const [events, totalItems] = await Promise.all([
      mongoQuery.exec(),
      Event.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.json({ meta: { page, limit, totalItems, totalPages }, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid event update", details: error.errors });
    }
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json({ message: "Event deleted" });
  } catch (error) {
    next(error);
  }
};
