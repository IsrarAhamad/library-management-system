const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
