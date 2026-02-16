import { Request, Response, NextFunction } from "express";
import Registration from "../models/registration.model";
import Event from "../models/event.model";
import User from "../models/user.model";

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Total revenue and tickets sold
    const registrations = await Registration.find().populate("event", "title price");
    const totalTicketsSold = registrations.length;
    const totalRevenue = registrations.reduce((sum, r) => sum + ((r.event as any)?.price || 0), 0);

    // Total events
    const totalEvents = await Event.countDocuments();

    // Active users (unique users who registered)
    const uniqueUsers = await Registration.distinct("user");
    const activeUsers = uniqueUsers.length;

    // Top events by revenue
    const topAgg = await Registration.aggregate([
      { $match: { event: { $exists: true } } },
      { $group: { _id: "$event", tickets: { $sum: 1 }, revenue: { $sum: "$price" } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, eventId: "$_id", title: "$event.title", tickets: 1, revenue: 1 } }
    ]).exec();

    res.json({
      message: "Reports generated",
      data: {
        totalRevenue,
        totalTicketsSold,
        totalEvents,
        activeUsers,
        topEvents: topAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};
