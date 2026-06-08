const router = require('express').Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} = require('../validators/authValidator');
const {
  signup,
  login,
  guestLogin,
  refreshToken,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  socialLogin,
  deleteAccount,
} = require('../controllers/authController');

router.post('/signup', validate(validateSignup), signup);
router.post('/login', validate(validateLogin), login);
router.post('/guest-login', guestLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', validate(validateForgotPassword), forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', validate(validateResetPassword), resetPassword);
router.put('/change-password', protect, validate(validateChangePassword), changePassword);
router.post('/social-login', socialLogin);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
