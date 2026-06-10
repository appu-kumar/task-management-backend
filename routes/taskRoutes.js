import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// all task routes protected

router.use(authMiddleware);

// Create

router.post("/", createTask);

// Get own tasks

router.get("/", getMyTasks);

// Update

router.put("/:id", updateTask);

// Delete

router.delete("/:id", deleteTask);

export default router;
