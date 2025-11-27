const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions
router.get('/', transactionController.getTransactions);
// POST /api/transactions/issue
router.post('/issue', transactionController.issueBook);
// POST /api/transactions/return
router.post('/return', transactionController.returnBook);
// GET /api/transactions/report
router.get('/report', transactionController.getReports);

module.exports = router;
