const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET /api/books
router.get('/', bookController.getBooks);
// GET /api/books/search
router.get('/search', bookController.searchBooks);
// GET /api/books/:id
router.get('/:id', bookController.getBook);
// POST /api/books
router.post('/', bookController.createBook);
// PUT /api/books/:id
router.put('/:id', bookController.updateBook);
// DELETE /api/books/:id
router.delete('/:id', bookController.deleteBook);

module.exports = router;
