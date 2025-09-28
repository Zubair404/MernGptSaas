const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'please provide a username'], unique: true },
  email: { type: String, required: [true, 'please provide an email'], unique: true , matchPassword: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'please provide a valid email',
  ]},
  password: { type: String, required: [true, 'please provide a password'], minlength: [6, 'password must be at least 6 characters'], select: false },
  customerid: { type: String , default: ''},
  subscriptionid: { type: String,default: ''},
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
// Generate JWT
userSchema.methods.getSignedJwtToken = function (res) {
  // Use explicit env names for access/refresh secrets and expiries
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessExpire = process.env.JWT_ACCESS_EXPIRE || '15m';
  const refreshExpire = process.env.JWT_REFRESH_EXPIRE || '30d';

  const accessToken = jwt.sign({ id: this._id }, accessSecret, { expiresIn: accessExpire });
  const refreshToken = jwt.sign({ id: this._id }, refreshSecret, { expiresIn: refreshExpire });

  // If a response is passed, set the refresh token as an HTTP-only cookie
  if (res && typeof res.cookie === 'function') {
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return { accessToken, refreshToken };
};
const User = mongoose.model('User', userSchema);
module.exports = User;