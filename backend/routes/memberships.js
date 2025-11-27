const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

// GET /api/memberships
router.get('/', membershipController.getMemberships);
// GET /api/memberships/:id
router.get('/:id', membershipController.getMembership);
// POST /api/memberships
router.post('/', membershipController.createMembership);
// PUT /api/memberships/:id
router.put('/:id', membershipController.updateMembership);
// DELETE /api/memberships/:id
router.delete('/:id', membershipController.deleteMembership);

module.exports = router;
