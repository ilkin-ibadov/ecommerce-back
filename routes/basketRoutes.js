const express = require('express');
const Basket = require('../models/basket');
const Product = require('../models/product');
const {authMiddleware} = require('../middleware/auth');

const router = express.Router();
// router.use(authMiddleware);

// Create or update basket
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let basket = await Basket.findOne({ userId });

    if (!basket) {
      basket = new Basket({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const productIndex = basket.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex !== -1) {
        basket.products[productIndex].quantity += quantity;
      } else {
        basket.products.push({ productId, quantity });
      }
    }

    // Calculate the total price
    let totalPrice = 0;

    for (const item of basket.products) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }

    basket.currency = '$'

    basket.price = totalPrice;

    // Save the basket
    await basket.save();

    res.status(200).json({ message: 'Basket updated successfully', basket });
  } catch (error) {
    res.status(500).json({ message: 'Error updating basket', error });
  }
});

// View basket
router.get('/view', async (req, res) => {
  const userId = req.user._id;

  try {
    const basket = await Basket.findOne({ userId }).populate('products.productId');

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }

    res.status(200).json({ basket });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving basket', error });
  }
});

// Remove product from basket
router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const basket = await Basket.findOne({ userId });
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }

    // Remove product from basket
    basket.products = basket.products.filter(
      (item) => item.productId.toString() !== productId
    );

    // Recalculate price
    let totalPrice = 0;
    for (const item of basket.products) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }
    basket.price = totalPrice;

    // Save updated basket
    await basket.save();
    res.status(200).json({ message: 'Product removed from basket', basket });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from basket', error });
  }
});

// Clear basket
router.delete('/remove/all', async (req, res) => {
  const userId = req.user._id;  // Get user ID from validated token

  try {
    const basket = await Basket.findOneAndDelete({ userId });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }

    res.status(200).json({ message: 'Basket cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing basket', error });
  }
});

module.exports = router;
