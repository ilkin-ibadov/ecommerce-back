const express = require("express");
const Product = require("../models/product");
const { authMiddleware, isAdminMiddleware, } = require("../middleware/auth");
const router = express.Router();

// Create product
router.post("/add", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Get all products 
router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, category, searchTerm } = req.query;
    const skip = (page - 1) * pageSize;

    const query = {};
    if (category) {
      query.category = category;
    }
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const [products, productCount] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(pageSize)),
      Product.countDocuments(query),
    ]);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      products,
      productCount,
      totalPages: Math.ceil(productCount / pageSize),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get single product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product with given id", error });
  }
});

// Update product by id
router.patch("/update/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete product by id
router.delete("/delete/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;


``