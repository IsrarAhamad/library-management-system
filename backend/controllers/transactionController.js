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
    const { bookId, userId, membershipId, issueDate, returnDate, remarks } = req.body;
    if (!bookId || !userId || !membershipId || !issueDate || !returnDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check book availability
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: 'Book not available' });
    }
    // Create transaction
    const transaction = new Transaction({
      book: bookId,
      user: userId,
      membership: membershipId,
      issueDate,
      returnDate,
      remarks
    });
    book.available = false;
    await book.save();
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Return book (with fine calculation placeholder)
exports.returnBook = async (req, res) => {
  try {
    const { transactionId, returnDate, remarks, finePaid } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
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
    const book = await Book.findById(transaction.book);
    if (book) {
      book.available = true;
      await book.save();
    }
    await transaction.save();
    res.json(transaction);
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
