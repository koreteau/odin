const express = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();


// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/login',
  [
      check('username', 'Please include a valid username').not().isEmpty(),
      check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      try {
          let user = await User.findOne({ username });
          if (!user) {
              return res.status(400).json({ msg: 'Invalid credentials' });
          }

          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
              return res.status(400).json({ msg: 'Invalid credentials' });
          }

          const payload = {
              user: {
                  id: user.id,
                  role: user.role,
              },
          };

          jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: '1h' },
              (err, token) => {
                  if (err) throw err;
                  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
              }
          );
      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
  }
);


// @route   GET /api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;