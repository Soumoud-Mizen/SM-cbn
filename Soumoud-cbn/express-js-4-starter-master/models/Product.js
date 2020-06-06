const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  cat: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('product', ProductSchema);
