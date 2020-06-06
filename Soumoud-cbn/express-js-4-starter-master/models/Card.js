const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  card_stripe_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  exp_month: {
    type: String,
    required: true
  },
  exp_year: {
    type: String,
    required: true
  },
  last4: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('card', CardSchema);
