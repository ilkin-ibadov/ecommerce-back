const mongoose = require('mongoose');

// Define the schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [30, "Title must be shorter than 30 characters"],
    required: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [100, "Description must be shorter than 100 characters"],
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
    required: true,
  },
  category: {
    type: String,
    enum: ["tech", "fashion", "furniture"],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  gallery: {
    type: [String],
    default: []
  },
});

// Create and export the model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
