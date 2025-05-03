const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;


router.post("/sign-up", async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;

    const userInDatabase = await User.findOne({ email });
    const userNameTaken = await User.findOne({ userName }); 

    if (userInDatabase) {
      return res.status(409).json({ err: "User already exists" });
    }

    if (userNameTaken) {
      return res.status(409).json({ err: "Username taken" });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await User.create({
      userName,
      firstName,
      lastName,
      email,
      hashedPassword,
      favouriteShops: []
    });

    const payload = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
      favouriteShops: user.favouriteShops
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);
    res.status(201).json({ token });

  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ error: error.message });
  }
});



router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Account not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
      favouriteShops: user.favouriteShops,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);
    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/delete-account/:user_id", async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.findByIdAndDelete(req.params.user_id);
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
