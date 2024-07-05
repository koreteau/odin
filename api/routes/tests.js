const express = require('express');
const router = express.Router();
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


// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Public
router.put('/:id', async (req, res) => {
  const { title, desc } = req.body;

  const testFields = {};
  if (title) testFields.title = title;
  if (desc) testFields.desc = desc;

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
});


// @route   DELETE /api/tests/:id
// @desc    Delete a test
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ msg: 'Test not found' });
    }

    await test.remove();

    res.json({ msg: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Test not found' });
    }
    res.status(500).send('Server Error');
  }
});



module.exports = router;
