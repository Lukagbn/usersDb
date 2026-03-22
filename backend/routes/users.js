const express = require("express");
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
    const newUser = new Users({
      firstName,
      lastName,
      email,
      password,
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
    if (user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });
    res.json({ message: "Logged in!", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
