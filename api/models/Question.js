// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    nameType: {
      type: String,
      required: true,
    },
    content: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    default: 'active',
  },
  activity: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      type: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Question', QuestionSchema);
