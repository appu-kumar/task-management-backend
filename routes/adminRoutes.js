import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
} from "../controllers/adminController.js";

import { getActivityLogs } from "../controllers/activityController.js";

const router = express.Router();

// protection for all admin APIs

router.use(authMiddleware, adminMiddleware);

// Users

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUser);

router.put("/users/:id/status", updateUserStatus);

// Tasks

router.get("/tasks", getAllTasks);

router.delete("/tasks/:id", deleteAnyTask);

// Logs

router.get("/logs", getActivityLogs);

export default router;
