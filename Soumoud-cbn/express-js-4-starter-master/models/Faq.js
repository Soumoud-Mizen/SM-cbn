const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  detail: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('faq', FaqSchema);
