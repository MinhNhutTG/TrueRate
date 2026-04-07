// controllers/product.controller.js
const { model } = require("mongoose");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Review = require("../../models/review.model");
const Order = require("../../models/order.model");

const detail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'fullName');

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("./client/pages/product/product-detail", {
      product,
      reviews,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const buy = async (req, res) => {
  try {
    const productId = req.params.id
    const userId = req.user._id

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' })
    }

    const order = await Order.create({
      userId,
      productId,
      price: product.price,
      status: 'completed',
      // txHash: txHash || null,
    })


    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedProducts: productId }
    })
    
    return res.json({ success: true, message: 'Mua hàng thành công' })
  } catch (err) {
    console.error('[muaHang]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

const review = async (req, res) => {
  try {
    const { rating, content } = req.body
    const productId = req.params.id
    const userId = req.user._id

    // Validate
    if (!rating || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' })
    }

    // Kiểm tra đã mua chưa
    const user = await User.findById(userId)
    if (!user.purchasedProducts.includes(productId)) {
      return res.status(403).json({ success: false, message: 'Bạn cần mua sản phẩm trước khi đánh giá' })
    }

    // Kiểm tra đã review chưa
    const existed = await Review.findOne({ product: productId, user: userId })
    if (existed) {
      return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' })
    }

    const review = await Review.create({ product: productId, user: userId, rating, content })
    await review.populate('user', 'fullName')

    return res.status(201).json({ success: true, review })
  } catch (err) {
    console.error('[guiReview]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

module.exports = {
  detail,
  buy,
  review
}
