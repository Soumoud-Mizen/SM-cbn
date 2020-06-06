const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  sender_id: {
    type: String,
    required: true,
    unique: true
  },
  rec_id: {
    type: String,
    required: true,
    unique: true
  },
  isValid: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('promotion', PromotionSchema);
