require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Book = require("./models/Book");
const Membership = require("./models/Membership");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/library_db";

async function seed() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear collections
  await User.deleteMany({});
  await Book.deleteMany({});
  await Membership.deleteMany({});

  // Admin and user
  const adminPass = await bcrypt.hash("adminpass", 10);
  const userPass = await bcrypt.hash("userpass", 10);

  await User.create([
    {
      username: "admin",
      password: adminPass,
      name: "Admin User",
      role: "admin",
      email: "admin@library.com",
    },
    {
      username: "user",
      password: userPass,
      name: "Regular User",
      role: "user",
      email: "user@library.com",
    },
  ]);

  // Seed Books
  await Book.create([
    {
      title: "DBMS",
      author: "C.J. Date",
      type: "book",
      available: true,
      serialNumber: "B001",
    },
    {
      title: "DSTL",
      author: "Jane Doe",
      type: "movie",
      available: true,
      serialNumber: "M001",
    },
    {
      title: "RER",
      author: "John Smith",
      type: "movie",
      available: true,
      serialNumber: "N001",
    },
  ]);

  // Memberships
  const today = new Date();
  const sixMonthsAhead = new Date(today);
  sixMonthsAhead.setMonth(today.getMonth() + 6);
  await Membership.create([
    {
      membershipNumber: "MEM001",
      memberName: "Admin User",
      active: true,
      startDate: today,
      endDate: sixMonthsAhead,
    },
    {
      membershipNumber: "MEM002",
      memberName: "Regular User",
      active: true,
      startDate: today,
      endDate: sixMonthsAhead,
    },
  ]);

  console.log("Seed data created.");
  mongoose.connection.close();
}
seed();
