const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  type: { type: String, enum: ['book', 'movie'], default: 'book', required: true },
  available: { type: Boolean, default: true },
  serialNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
