import { Router } from "express";
import {
  register,
  login,
  getRoles,
  getUsersWithRoles,
  updateUserStatus,
} from "../controller/user.controller";
import { checkUserExists } from "../middlewares/checkUserExists.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { body } from "express-validator";

const router = Router();

router.post("/register", checkUserExists, register);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validationMiddleware,
  login
);
router.get("/roles", getRoles);

router.get("/users", getUsersWithRoles);

router.post("/update-user-status", updateUserStatus);

export default router;
