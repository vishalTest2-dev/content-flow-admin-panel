const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  category: { type: String },
});

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;