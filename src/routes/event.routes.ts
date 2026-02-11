import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/event.controller";
import { eventValidationRules } from "../middlewares/event.validation";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.post("/", eventValidationRules.create, validateRequest, createEvent);
router.get("/", eventValidationRules.get, validateRequest, getEvents);
router.get("/:id", eventValidationRules.id, validateRequest, getEventById);
router.put("/:id", eventValidationRules.update, eventValidationRules.id, validateRequest, updateEvent);
router.delete("/:id", eventValidationRules.id, validateRequest, deleteEvent);

export default router;
