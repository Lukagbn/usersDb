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
    const newUser = new Users({ firstName, lastName, email, password, gender });
    await newUser.save();
    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
