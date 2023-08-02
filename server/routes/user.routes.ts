import { Router } from "express";
import { register, login, getRoles } from "../controller/user.controller";
import { checkUserExists } from "../middleware/checkUserExists.middleware";

const router = Router();

router.post("/register", checkUserExists, register);

router.post("/login", login);

router.get("/roles", getRoles);

export default router;
