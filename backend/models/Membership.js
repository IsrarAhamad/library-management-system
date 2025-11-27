const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  membershipNumber: { type: String, required: true, unique: true },
  memberName: { type: String, required: true },
  active: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  cancelled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Membership', MembershipSchema);
