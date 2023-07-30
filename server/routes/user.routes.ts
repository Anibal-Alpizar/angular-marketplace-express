import { Router } from "express";
import { register, login, getRoles } from "../controller/user.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/roles", getRoles);

export default router;
