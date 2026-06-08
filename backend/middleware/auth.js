const { verifyAccessToken } = require('../utils/tokenHelper');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Access token is required');
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password -refreshTokens');

      if (!user) {
        return ApiResponse.unauthorized(res, 'User not found');
      }

      if (!user.isActive) {
        return ApiResponse.forbidden(res, 'Account has been deactivated');
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Access token expired');
      }
      return ApiResponse.unauthorized(res, 'Invalid access token');
    }
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = await User.findById(decoded.id).select('-password -refreshTokens');
      } catch (err) {
        // Token invalid, continue as guest
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return ApiResponse.forbidden(res, 'Admin access required');
};

module.exports = { protect, optionalAuth, adminOnly };
