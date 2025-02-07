const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 User Registration (Signup)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Guest Mode - Limited Access
// router.post("/guest", async (req, res) => {
//   try {
//     const guestUser = new User({ name: "Guest", email: `guest_${Date.now()}@guest.com`, password: "guest123", role: "guest" });
//     await guestUser.save();

//     res.status(201).json({
//       message: "Guest mode activated",
//       token: generateToken(guestUser._id),
//       user: { id: guestUser._id, name: guestUser.name, role: guestUser.role },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

module.exports = router;
