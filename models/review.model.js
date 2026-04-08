const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review phải thuộc về một sản phẩm'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review phải thuộc về một người dùng'],
    },
    rating: {
      type: Number,
      required: [true, 'Vui lòng chọn số sao đánh giá'],
      min: [1, 'Đánh giá tối thiểu 1 sao'],
      max: [5, 'Đánh giá tối đa 5 sao'],
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung đánh giá'],
      trim: true,
      minlength: [10, 'Nội dung đánh giá tối thiểu 10 ký tự'],
      maxlength: [1000, 'Nội dung đánh giá tối đa 1000 ký tự'],
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Review phải liên kết với một đơn hàng đã hoàn thành'],
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // tự tạo createdAt, updatedAt
  }
)

// mua lại thì review lại được ✅ mỗi order = 1 review
reviewSchema.index({ orderID: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema, 'Reviews')