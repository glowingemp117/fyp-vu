const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");

exports.getMyProfile = async (req, res, next) => {
  try {
    return ApiResponse.success(res, req.user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ["name", "phone", "city", "avatar", "timezone"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return ApiResponse.success(
      res,
      user.toSafeObject(),
      "Profile updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

exports.updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    return ApiResponse.success(res, null, "FCM token updated");
  } catch (error) {
    next(error);
  }
};
