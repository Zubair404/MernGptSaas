const USER = require('../models/user');
const ErrorResponse = require('../utilities/errorResponse');
const JWT = require('jsonwebtoken');

const  sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  // token is an object { accessToken, refreshToken }
  res.status(statusCode).json({ success: true, token });
}

// Register User
exports.register = async (req, res, next) => {
    let { username, email, password } = req.body;
    if (email && typeof email === 'string') email = email.toLowerCase().trim();
    try {
    const existingemail = await USER.findOne({ email });
    if (existingemail) {
      return next(new ErrorResponse('Email already exists', 400));
    }
    const user = await USER.create({ username, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
    try {
      const lookupEmail = (email && typeof email === 'string') ? email.toLowerCase().trim() : email;
      console.log('Login attempt for:', lookupEmail);
      const user = await USER.findOne({ email: lookupEmail }).select('+password');
      if (!user) {
        console.log('User not found for email:', lookupEmail);
      } else {
        console.log('User found id=', user._id);
      }
      if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        console.log('Password mismatch for user id=', user._id);
        return next(new ErrorResponse('Invalid credentials', 401));
      }
      sendTokenResponse(user, 200, res);
    } catch (err) {
      next(err);
    }
  };

// Get current logged in user
exports.getMe = async (req, res, next) => {
  try {
    const user = await USER.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Logout user / clear cookie
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};