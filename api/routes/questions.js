// routes/questions.js
const express = require('express');
const Question = require('../models/Question');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
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



// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('type.nameType', 'Question type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, type, status, activity } = req.body;

    try {
      const newQuestion = new Question({
        title,
        type,
        status,
        author: req.user.id,
        activity: [
          {
            author: req.user.id,
            type: 'creation',
            date: new Date(),
          },
        ],
      });

      const question = await newQuestion.save();
      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);



module.exports = router;
