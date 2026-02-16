import { body, param, query } from "express-validator";

const allowedStatuses = [
  "active",
  "upcoming",
  "scheduled",
  "cancelled",
  "completed",
  "sold-out",
] as const;

export const eventValidator = {
  create: [
    body("title").isString().withMessage("Title must be a string").notEmpty().withMessage("Title is required").isLength({ max: 150 }).withMessage("Title must be at most 150 characters"),
    body("description").isString().withMessage("Description must be a string").notEmpty().withMessage("Description is required").isLength({ max: 2000 }).withMessage("Description must be at most 2000 characters"),
    body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date").custom((value) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return false;
      return d.getTime() >= Date.now();
    }).withMessage("Date must be now or in the future"),
    body("location").isString().withMessage("Location must be a string").notEmpty().withMessage("Location is required"),
    body("status").optional().isIn(allowedStatuses as unknown as string[]).withMessage(`Status must be one of: ${allowedStatuses.join(", ")}`),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be an integer >= 1"),
  ],

  update: [
    body("title").optional().isString().withMessage("Title must be a string").isLength({ max: 150 }).withMessage("Title must be at most 150 characters"),
    body("description").optional().isString().withMessage("Description must be a string").isLength({ max: 2000 }).withMessage("Description must be at most 2000 characters"),
    body("date").optional().isISO8601().withMessage("Date must be a valid ISO 8601 date").custom((value) => new Date(value).getTime() >= Date.now()).withMessage("Date must be now or in the future"),
    body("location").optional().isString().withMessage("Location must be a string"),
    body("status").optional().isIn(allowedStatuses as unknown as string[]).withMessage(`Status must be one of: ${allowedStatuses.join(", ")}`),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be an integer >= 1"),
  ],

  get: [
    query("date").optional().isISO8601().withMessage("Date filter must be ISO 8601"),
    query("location").optional().isString().withMessage("Location filter must be a string"),
    query("title").optional().isString().withMessage("Title filter must be a string"),
    query("capacity").optional().isInt({ min: 1 }).withMessage("Capacity filter must be an integer >= 1"),
    query("status").optional().isIn(allowedStatuses as unknown as string[]).withMessage(`Status filter must be one of: ${allowedStatuses.join(", ")}`),
    query("sort").optional().isString().withMessage("Sort must be a string"),
    query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be an integer >= 1"),
  ],

  id: [param("id").isMongoId().withMessage("Invalid event id")],
};

export default eventValidator;
