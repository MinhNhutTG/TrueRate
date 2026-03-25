const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  brand: String,
  category: String,
  badge: String,
  oldPrice: Number,
  rating: Number,
  reviews: Number,
  stock: Number,
  image: String,
  tags: [String],
  createdAt: Date
});

module.exports = mongoose.model("Product", productSchema, "Products");