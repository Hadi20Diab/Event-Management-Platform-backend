import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      includeRegistrations,
      date: dateQ,
      location: locationQ,
      status: statusQ,
      title: titleQ,
      capacity: capacityQ,
      sort: sortQ = "createdAt",
      order: orderQ = "desc",
      page: pageQ,
      limit: limitQ,
    } = req.query as Record<string, string>;

    const page = Math.max(1, Number(pageQ) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitQ) || 10));

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
    if (titleQ) filter.title = { $regex: new RegExp(titleQ, "i") };
    if (capacityQ) {
      const c = Number(capacityQ);
      if (!Number.isNaN(c)) filter.capacity = c;
    }

    const query = Event.find(filter)
      .sort({ [sortQ]: (orderQ || "desc").toLowerCase() === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (includeRegistrations === "true") query.populate("registrations");

    const [events, totalItems] = await Promise.all([query.exec(), Event.countDocuments(filter).exec()]);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.json({ meta: { page, limit, totalItems, totalPages }, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeRegistrations = req.query.includeRegistrations === "true";
    let query = Event.findById(req.params.id);
    if (includeRegistrations) query = query.populate("registrations");
    const event = await query.exec();
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
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
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
