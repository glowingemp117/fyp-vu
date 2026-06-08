const validator = require('validator');

const validateSignup = (body) => {
  const errors = [];
  const { name, email, password, confirmPassword } = body;

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name must be at least 2 characters' });
  }
  if (!email || !validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }
  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!email || !validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

const validateForgotPassword = (body) => {
  const errors = [];
  if (!body.email || !validator.isEmail(body.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }
  return errors;
};

const validateResetPassword = (body) => {
  const errors = [];
  if (!body.otp || body.otp.length !== 6) {
    errors.push({ field: 'otp', message: 'OTP must be 6 digits' });
  }
  if (!body.email || !validator.isEmail(body.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  if (!body.newPassword || body.newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'Password must be at least 6 characters' });
  }
  return errors;
};

const validateChangePassword = (body) => {
  const errors = [];
  if (!body.currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }
  if (!body.newPassword || body.newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters' });
  }
  return errors;
};

module.exports = {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
};
