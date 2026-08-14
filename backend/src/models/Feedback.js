const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  expected_label: {
    type: String,
    enum: ['Real', 'Fake'],
    required: true,
  },
  url: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
