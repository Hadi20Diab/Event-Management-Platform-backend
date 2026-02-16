import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Admin from "../models/admin.model";
import Event from "../models/event.model";
import Registration from "../models/registration.model";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get counts in parallel for better performance
    const [totalUsers, totalAdmins, totalEvents, activeEvents, registrations] = await Promise.all([
      User.countDocuments(),
      Admin.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: { $in: ['active', 'upcoming'] } }),
      Registration.find().populate('event', 'price')
    ]);

    // Calculate total revenue from registrations
    const totalRevenue = registrations.reduce((total, registration) => {
      const eventPrice = (registration.event as any)?.price || 0;
      return total + eventPrice;
    }, 0);

    // Get recent activity
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category date status createdAt');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title date');

    const stats = {
      totals: {
        users: totalUsers,
        admins: totalAdmins,
        events: totalEvents,
        activeEvents: activeEvents,
        registrations: registrations.length,
        revenue: totalRevenue
      },
      recentActivity: {
        events: recentEvents,
        users: recentUsers,
        registrations: recentRegistrations
      }
    };

    res.json({
      message: "Dashboard statistics retrieved successfully",
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalAdmins, superAdminCount, regularAdminCount] = await Promise.all([
      Admin.countDocuments(),
      Admin.countDocuments({ role: 'superAdmin' }),
      Admin.countDocuments({ role: 'admin' })
    ]);

    const adminsByRole = await Admin.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      message: "Admin statistics retrieved successfully",
      data: {
        total: totalAdmins,
        superAdmins: superAdminCount,
        admins: regularAdminCount,
        breakdown: adminsByRole
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Get users with their registration counts
    const userRegistrationStats = await User.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'user',
          as: 'registrations'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          createdAt: 1,
          registrationCount: { $size: '$registrations' }
        }
      },
      {
        $sort: { registrationCount: -1 }
      }
    ]);

    // Get user registration trends (monthly)
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      message: "User statistics retrieved successfully",
      data: {
        total: totalUsers,
        registrationStats: userRegistrationStats,
        trends: registrationTrends
      }
    });
  } catch (error) {
    next(error);
  }
};