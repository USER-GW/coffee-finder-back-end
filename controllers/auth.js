const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;


router.post("/sign-up", async (req, res) => {
    try {
     
      const userInDatabase = await User.findOne({ email: req.body.email });
  
      if (userInDatabase) {
        return res.status(409).json({ error: "User already exists" });
      }
  
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
      });
  

      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      };
  
      const token = jwt.sign({ payload }, process.env.JWT_SECRET);
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post ("/sign-in", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

      
        if (!user) {
            return res.status(401).json({error: "Account not found"});  
        }
     
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);

        
        if (!isPasswordCorrect) {
            return res.status(401).json({error: "Invalid credentials"});
        }

      
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
          };

    
    const token = jwt.sign({payload}, process.env.JWT_SECRET);

   
    res.status(200).json({token});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete("/delete-account/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findOne({ _id: user_id });

        if (!user) {
            return res.status(401).json({ error: "Account not found" });
        }

        await User.deleteOne({ _id: user._id });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

