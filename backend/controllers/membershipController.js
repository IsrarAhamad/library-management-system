const Membership = require('../models/Membership');

// List all memberships
exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single membership by ID
exports.getMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create membership
exports.createMembership = async (req, res) => {
  try {
    const { membershipNumber, memberName, startDate, endDate } = req.body;
    if (!membershipNumber || !memberName || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newMembership = new Membership({ membershipNumber, memberName, startDate, endDate });
    await newMembership.save();
    res.status(201).json(newMembership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Extend or cancel membership (by membership ID)
exports.updateMembership = async (req, res) => {
  try {
    const data = req.body;
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });

    if (data.cancelled !== undefined) {
      membership.cancelled = data.cancelled;
      membership.active = !data.cancelled;
    }
    if (data.extend) {
      const newEnd = new Date(membership.endDate);
      newEnd.setMonth(newEnd.getMonth() + 6);
      membership.endDate = newEnd;
    }
    membership.memberName = data.memberName || membership.memberName;
    membership.membershipNumber = data.membershipNumber || membership.membershipNumber;
    await membership.save();
    res.json(membership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete membership
exports.deleteMembership = async (req, res) => {
  try {
    const deleted = await Membership.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Membership not found' });
    res.json({ message: 'Membership deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
