const express = require('express');
const router = express.Router();
const { summary } = require('../controllers/openai');
router.post('/summary', summary);
module.exports = router;