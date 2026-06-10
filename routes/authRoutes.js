import { register, login, logout } from "../controllers/authController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authMiddleware, getMe);

export default router;
