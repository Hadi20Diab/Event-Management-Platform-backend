import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/event.controller";
import eventValidator from "../validators/event.validator";
import validateRequest from "../middlewares/validateRequest";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, adminOnly, eventValidator.create, validateRequest, createEvent);
router.get("/", eventValidator.get, validateRequest, getEvents);
router.get("/:id", eventValidator.id, validateRequest, getEventById);
router.put("/:id", protect, adminOnly, eventValidator.update, eventValidator.id, validateRequest, updateEvent);
router.delete("/:id", protect, adminOnly, eventValidator.id, validateRequest, deleteEvent);

export default router;
