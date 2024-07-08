// models/Tests.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  answerDate: {
    type: Date,
    required: true,
  },
});

const ActivitySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
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
});

const TestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  results: [ResultSchema],
  activity: [ActivitySchema],
  content: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    },
  ],
  status: {
    type: String,
    default: 'active',
  },
});

module.exports = mongoose.model('Test', TestSchema);
