import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    action: {
      type: String,

      enum: [
        "LOGIN",
        "LOGOUT",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "USER_DELETED",
        "USER_STATUS_UPDATED",
      ],

      required: true,
    },

    description: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
