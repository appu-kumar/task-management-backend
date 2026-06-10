import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";

// CREATE TASK

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,

      description,

      createdBy: req.user._id,
    });

    // activity log

    await ActivityLog.create({
      userId: req.user._id,

      action: "TASK_CREATED",

      description: `Created task: ${task.title}`,
    });

    res.status(201).json({
      message: "Task created",

      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET OWN TASKS

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // ownership check

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    task.title = req.body.title || task.title;

    task.description = req.body.description || task.description;

    task.status = req.body.status || task.status;

    await task.save();

    await ActivityLog.create({
      userId: req.user._id,

      action: "TASK_UPDATED",

      description: `Updated task: ${task.title}`,
    });

    res.json({
      message: "Task updated",

      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // check owner

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await task.deleteOne();

    await ActivityLog.create({
      userId: req.user._id,

      action: "TASK_DELETED",

      description: `Deleted task: ${task.title}`,
    });

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
