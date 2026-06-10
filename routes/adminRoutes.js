import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/users",

  authMiddleware,

  adminMiddleware,

  getAllUsers,
);

export default router;
