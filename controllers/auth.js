const USER = require('../models/user');
const ErrorResponse = require('../utilities/errorresponse');
const JWT = require('jsonwebtoken');

const  sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token });
}

// Register User
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const existingemail = await USER.find(email());
    if(existingemail){
        return next(new ErrorResponse('Email already exists', 400));
    }
  try {
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
      const user = await USER.findOne({ email }).select('+password');
      if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
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
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
};