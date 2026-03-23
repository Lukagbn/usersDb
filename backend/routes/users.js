const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Users = require("../models/Users.js");

router.get("/", async (req, res) => {
  try {
    const allUsers = await Users.find();
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;
    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "email already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
    });
    await newUser.save();
    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/auth", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ message: "Logged in!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
