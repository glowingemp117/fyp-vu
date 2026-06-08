const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const { generateTokenPair, verifyRefreshToken } = require('../utils/tokenHelper');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, fcmToken, timezone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.badRequest(res, 'Email already registered');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      fcmToken: fcmToken || '',
      timezone: timezone || 'Asia/Karachi',
    });

    const tokens = generateTokenPair(user._id);

    // Store refresh token
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save({ validateBeforeSave: false });

    return ApiResponse.created(res, {
      user: user.toSafeObject(),
      ...tokens,
    }, 'Account created successfully');
  } catch (error) {
    console.log("Signup error:", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Account has been deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Update FCM token
    if (fcmToken) {
      user.fcmToken = fcmToken;
    }

    const tokens = generateTokenPair(user._id);
    user.refreshTokens.push({ token: tokens.refreshToken });

    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, {
      user: user.toSafeObject(),
      ...tokens,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.guestLogin = async (req, res, next) => {
  try {
    const guestEmail = `guest_${Date.now()}@prizebond.app`;
    const user = await User.create({
      name: 'Guest User',
      email: guestEmail,
      password: `guest_${Date.now()}_${Math.random().toString(36)}`,
      role: 'user',
      fcmToken: req.body.fcmToken || '',
    });

    const tokens = generateTokenPair(user._id);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, {
      user: user.toSafeObject(),
      ...tokens,
    }, 'Guest login successful');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return ApiResponse.badRequest(res, 'Refresh token is required');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      // Possible token reuse attack - clear all tokens
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      return ApiResponse.unauthorized(res, 'Token reuse detected. Please login again.');
    }

    // Remove used refresh token and generate new pair
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    const tokens = generateTokenPair(user._id);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, tokens, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user._id);

    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
      user.fcmToken = '';
      await user.save({ validateBeforeSave: false });
    }

    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return ApiResponse.notFound(res, 'No account found with this email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };
    await user.save({ validateBeforeSave: false });

    // TODO: Send OTP via email service (e.g., SendGrid, Nodemailer)
    console.log(`OTP for ${email}: ${otp}`);

    return ApiResponse.success(res, null, 'OTP sent to your email');
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.otp || !user.otp.code) {
      return ApiResponse.badRequest(res, 'Invalid request');
    }

    if (user.otp.expiresAt < new Date()) {
      return ApiResponse.badRequest(res, 'OTP has expired');
    }

    if (user.otp.code !== otp) {
      return ApiResponse.badRequest(res, 'Invalid OTP');
    }

    // Mark as verified
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, null, 'OTP verified successfully');
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.otp || user.otp.code !== otp) {
      return ApiResponse.badRequest(res, 'Invalid OTP');
    }

    if (user.otp.expiresAt < new Date()) {
      return ApiResponse.badRequest(res, 'OTP has expired');
    }

    user.password = newPassword;
    user.otp = undefined;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    return ApiResponse.success(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    const tokens = generateTokenPair(user._id);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, tokens, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

exports.socialLogin = async (req, res, next) => {
  try {
    const { socialId, socialProvider, name, email, fcmToken } = req.body;

    let user = await User.findOne({ socialId, socialProvider });

    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.socialId = socialId;
        user.socialProvider = socialProvider;
        await user.save({ validateBeforeSave: false });
      }
    }

    if (!user) {
      user = await User.create({
        name: name || 'User',
        email: email || `${socialProvider}_${socialId}@prizebond.app`,
        password: `social_${Date.now()}_${Math.random().toString(36)}`,
        socialId,
        socialProvider,
        isVerified: true,
        fcmToken: fcmToken || '',
      });
    }

    if (fcmToken) {
      user.fcmToken = fcmToken;
    }

    const tokens = generateTokenPair(user._id);
    user.refreshTokens.push({ token: tokens.refreshToken });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(res, {
      user: user.toSafeObject(),
      ...tokens,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return ApiResponse.success(res, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};
