const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Membership = require('../models/Membership');

// List all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('book user membership');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Issue a book
exports.issueBook = async (req, res) => {
  try {
    const { serialNumber, userId, membershipId, issueDate, returnDate, remarks } = req.body;
    if (!serialNumber || !membershipId || !issueDate || !returnDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Find book by serial number
    const book = await Book.findOne({ serialNumber });
    if (!book || !book.available) {
      return res.status(400).json({ message: 'Book not available' });
    }
    // Find user from membership if userId not provided
    let finalUserId = userId;
    if (!finalUserId && membershipId) {
      const membership = await Membership.findById(membershipId).populate('user');
      if (membership && membership.user) {
        finalUserId = membership.user._id;
      }
    }
    if (!finalUserId) {
      return res.status(400).json({ message: 'Could not determine user.' });
    }
    const transaction = new Transaction({
      book: book._id,
      user: finalUserId,
      membership: membershipId,
      issueDate,
      returnDate,
      remarks
    });
    book.available = false;
    await book.save();
    await transaction.save();
    res.status(201).json({ message: 'Book is issued', transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Return book (by serialNumber only)
exports.returnBook = async (req, res) => {
  try {
    const { serialNumber, returnDate, remarks, finePaid } = req.body;
    // Find book by serial number
    const book = await Book.findOne({ serialNumber });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // Find non-returned transaction for this book
    const transaction = await Transaction.findOne({ book: book._id, finePaid: false }); // or other means to filter ongoing
    if (!transaction) {
      return res.status(404).json({ message: 'Issued transaction not found' });
    }
    // Fine: $5 per day late (example logic)
    const expectedReturn = new Date(transaction.returnDate);
    const actualReturn = new Date(returnDate);
    let fine = 0;
    if (actualReturn > expectedReturn) {
      const diffDays = Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60 * 24));
      fine = diffDays * 5;
    }
    transaction.returnDate = actualReturn;
    transaction.remarks = remarks || transaction.remarks;
    transaction.fine = fine;
    if (fine > 0) {
      if (finePaid) {
        transaction.finePaid = true;
      } else {
        transaction.finePaid = false;
        return res.status(400).json({ message: 'Fine must be paid to return book' });
      }
    } else {
      transaction.finePaid = true;
    }
    // Make the book available again
    book.available = true;
    await book.save();
    await transaction.save();
    res.json({ message: 'Book is returned', transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all transactions for reports
exports.getReports = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('book user membership');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
