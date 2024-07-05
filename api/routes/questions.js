// routes/questions.js
const express = require('express');
const Question = require('../models/Question');
const router = express.Router();



// @route   GET /api/questions
// @desc    Get all questions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




module.exports = router;
