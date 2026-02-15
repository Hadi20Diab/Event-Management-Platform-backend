import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

import eventValidator from "../validators/event.validator";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  eventValidator.create,
  validateRequest,
  createEvent,
);
router.get("/", eventValidator.get, validateRequest, getEvents);
router.get("/:id", eventValidator.id, validateRequest, getEventById);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  eventValidator.update,
  eventValidator.id,
  validateRequest,
  updateEvent,
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  eventValidator.id,
  validateRequest,
  deleteEvent,
);

export default router;
