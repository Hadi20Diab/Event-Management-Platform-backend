// src/validators/admin.validator.ts
import { body, param } from "express-validator";

export const idValidator = [
  param("id").isMongoId().withMessage("Invalid admin ID"),
];

export const createAdminValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("phone").notEmpty().withMessage("Phone number is required"),

  body("role")
    .isIn(["admin", "superAdmin"])
    .withMessage("Role must be either admin or superAdmin"),
];

export const updateAdminValidator = [
  ...idValidator,

  body("name").optional().notEmpty().withMessage("Name cannot be empty"),

  body("email").optional().isEmail().withMessage("Must be a valid email"),

  body("phone").optional().notEmpty().withMessage("Phone cannot be empty"),

  body("role")
    .optional()
    .isIn(["admin", "superAdmin"])
    .withMessage("Role must be either admin or superAdmin"),
];
