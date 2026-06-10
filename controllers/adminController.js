import User from "../models/User.js";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";

// GET ALL USERS

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE USER

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER STATUS

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,

      {
        status,
      },

      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Status updated",

      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL TASKS

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ANY TASK

export const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    await ActivityLog.create({
      userId: req.user._id,

      action: "TASK_DELETED",

      description: `Admin deleted task ${task.title}`,
    });

    res.json({
      message: "Task deleted by admin",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ACTIVITY LOGS

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()

      .populate("userId", "name email")

      .sort({
        createdAt: -1,
      });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
