import { Router, Request, Response, NextFunction } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/event.controller";
import { eventValidationRules } from "../middlewares/event.validation";
import { validationResult } from "express-validator";

const router = Router();

function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.post("/", eventValidationRules.create, validate, createEvent);
router.get("/", eventValidationRules.get, validate, getEvents);
router.get("/:id", eventValidationRules.id, validate, getEventById);
router.put("/:id", eventValidationRules.update, eventValidationRules.id, validate, updateEvent);
router.delete("/:id", eventValidationRules.id, validate, deleteEvent);

export default router;
