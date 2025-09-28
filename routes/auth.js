const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth');
router.post('/register', register);
router.post('/login', login);
router.post ('/logout', logout);

router.get('/me', getMe);
module.exports = router;