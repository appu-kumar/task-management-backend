import jwt from "jsonwebtoken";

import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check cookie first

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // If no cookie check header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // Verify token. if expired or invalid it will throw an error and we will catch it in the catch block

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
