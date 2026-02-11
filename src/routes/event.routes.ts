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

const router = Router();

router.post("/", eventValidator.create, validateRequest, createEvent);
router.get("/", eventValidator.get, validateRequest, getEvents);
router.get("/:id", eventValidator.id, validateRequest, getEventById);
router.put("/:id", eventValidator.update, eventValidator.id, validateRequest, updateEvent);
router.delete("/:id", eventValidator.id, validateRequest, deleteEvent);

export default router;
