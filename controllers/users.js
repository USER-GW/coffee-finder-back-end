const express = require("express");
const router = express.Router();

const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");
const coffeeDataModel = require("../models/coffee-data");





router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ADD favourite shop


module.exports = router;
