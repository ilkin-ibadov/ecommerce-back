const mongoose = require('mongoose');

// Define the Basket schema
const basketSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, 
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "cancelled", "confirmed"],
    default: "pending",
  },
  price: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;
