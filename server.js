const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes"); 
const productRoutes = require("./routes/productRoutes"); 
const basketRoutes = require("./routes/basketRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

dotenv.config();

app.use(cors()); 
app.use(express.json()); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

app.use("/api/auth", authRoutes); 
app.use("/api/products", productRoutes); 
app.use("/api/baskets", basketRoutes);
app.use("/api/users", userRoutes);

app.get("/test", (req, res) => {
  res.send("Welcome to the API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
