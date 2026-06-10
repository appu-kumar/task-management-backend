// GET ALL ACTIVITY LOGS
import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()

      // replace userId ObjectId with user data
      .populate("userId", "name email role")

      // latest logs first
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
