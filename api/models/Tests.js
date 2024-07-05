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
  // Ajoutez d'autres champs si nécessaire
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
});

module.exports = mongoose.model('Test', TestSchema);
