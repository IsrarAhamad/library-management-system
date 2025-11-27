const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(200).json({ token, role: user.role, name: user.name, id: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register/signup (for user signup, not just admin seed)
exports.register = async (req, res) => {
  const { username, password, name, role, email } = req.body;
  if (!username || !password || !name || !role || !email) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const exists = await User.findOne({ $or: [{username}, {email}] });
    if (exists) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hash, name, role, email });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
