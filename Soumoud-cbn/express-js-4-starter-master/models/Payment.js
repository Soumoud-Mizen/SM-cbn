const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  card_id: {
    type: String,
    required: true
  },
  charge_id: {
    type: String,
    required: true
  },
  provider_id: {
    type: String,
    required: true
  },
  provider_name: {
    type: String,
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  last_4_card: {
    type: String,
    required: true
  },
  brand_card: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('payment', PaymentSchema);
