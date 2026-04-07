// models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number, required: true }, // lưu giá tại thời điểm mua
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    txHash: { type: String, default: null },       // hash giao dịch thanh toán
    reviewStatus: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending',
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema,"Orders");
