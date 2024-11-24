const jwt = require('jsonwebtoken');
const User = require("../models/user")

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; 

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAdminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (user && user.admin) {
    return next();
  } else {
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }
};

module.exports = { authMiddleware, isAdminMiddleware };
