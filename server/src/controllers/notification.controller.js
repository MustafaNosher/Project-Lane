import Notification from "../models/notification.js";
import { successResponse, errorResponse } from "../utils/response.js";

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name profilePicture");

    return successResponse(res, 200, "Notifications fetched successfully", notifications);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (notificationId === "all") {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        return successResponse(res, 200, "All notifications marked as read");
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return errorResponse(res, 404, "Notification not found or access denied");
    }

    notification.isRead = true;
    await notification.save();

    return successResponse(res, 200, "Notification marked as read", notification);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export { getNotifications, markAsRead };
