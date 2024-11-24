const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const {generateAccessToken , generateRefreshToken} = require("../utils/token");

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const processStatus = await user.save();
    processStatus ? res.status(201).json({ message: 'User registered successfully' })
    : res.status(400).json({ message: 'An error occurred while registering the user' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with given email not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Refresh token
router.post("/refresh",async(req,res)=>{
  const refreshToken=req.body.refreshToken;
  
  if(!refreshToken) return res.status(400).json({ message: 'No refresh token received' });

  jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,user)=>{
      if(err) return res.status(401).json({ message: 'Refresh token authentication failed' });

      const accessToken=generateAccessToken(user.id);
      
      res.status(200).json({accessToken});
  });
});

module.exports = router;
