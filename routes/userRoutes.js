const express = require("express");
const User = require("../models/user");
const router = express.Router();
const {authMiddleware} = require('../middleware/auth');

router.use(authMiddleware)

// Edit User
router.patch('/update', async (req, res) => {
  const { id } = req.user;

  try {
    const { firstname, lastname, email } = req.body;

    // Find and update the user
    const processResult = await User.findByIdAndUpdate(id, { firstname, lastname, email });

    processResult ? res.status(200).json({ message: 'User successfully edited' })
      : res.status(400).json({ message: 'Error while updating user' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Delete User
router.delete('/delete', async (req, res) => {
  const { id } = req.user;

  try {
    const processResult = await User.findByIdAndDelete(id);

    processResult ? res.status(200).json({ message: 'User deleted successfully' }) : res.status(400).json({ message: 'Error while deleting user' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router;
