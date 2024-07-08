const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Test = require('../models/Tests');



// @route   GET /api/tests
// @desc    Get all tests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   GET /api/tests/:id
// @desc    Get test by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ msg: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Test not found' });
    }
    res.status(500).send('Server Error');
  }
});



// @route   POST /api/tests
// @desc    Create a test
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, desc, content, status, activity } = req.body;

  try {
    const newTest = new Test({
      title,
      desc,
      content,
      status,
      author: req.user.id,
      activity
    });

    const test = await newTest.save();
    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('desc', 'Description is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc, content, status, activity } = req.body;

    const testFields = {};
    if (title) testFields.title = title;
    if (desc) testFields.desc = desc;
    if (content) testFields.content = content;
    if (status) testFields.status = status;
    if (activity) testFields.activity = activity;

    try {
      let test = await Test.findById(req.params.id);

      if (!test) {
        return res.status(404).json({ msg: 'Test not found' });
      }

      test = await Test.findByIdAndUpdate(
        req.params.id,
        { $set: testFields },
        { new: true }
      );

      res.json(test);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Test not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);



// @route   DELETE /api/tests/:id
// @desc    Delete a test
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      console.log('Test not found');
      return res.status(404).json({ msg: 'Test not found' });
    }

    // Check if the user deleting the test is the author
    if (test.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await test.deleteOne();
    res.json({ msg: 'Test removed' });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});




module.exports = router;
