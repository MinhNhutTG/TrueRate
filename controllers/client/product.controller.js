// controllers/product.controller.js
const { model } = require("mongoose");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Review = require("../../models/review.model");
const Order = require("../../models/order.model");
const crypto = require('crypto')
const { ethers } = require('ethers');
const abi = [
  "function submitReview(string orderId,string productId,bytes32 reviewHash) public",
  "function hasReviewed(string orderId) view returns(bool)",
  "function getReviewByOrder(string orderId) view returns(uint256,bytes32,address,uint256)"
];
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);


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

    const order = await Order.findOne({
      userId: userId,
      productId: productId,
      status: 'completed',
      reviewStatus: 'pending'
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa có đơn hàng hợp lệ để đánh giá hoặc đã đánh giá rồi'
      });
    }

    const already = await contract.hasReviewed(order._id.toString());

    if (already) {
      return res.status(400).json({
        success: false,
        message: 'Order đã review trên blockchain'
      });
    }

    const hash = ethers.keccak256(
      ethers.toUtf8Bytes(
        `${order._id}-${userId}-${content}`
      )
    );


    console.log('Hash duoc tao:', hash)



    const tx = await contract.submitReview(
      order._id.toString(),
      productId.toString(),
      hash
    );

    console.log('hash dc tao trong block chain  :', tx.hash)

    await tx.wait();

    const review = await Review.create({ product: productId, user: userId, rating, content, orderID: order._id, txHash: tx.hash })
    await review.populate('user', 'fullName')

    order.reviewStatus = 'reviewed';
    await order.save();

    return res.status(201).json({ success: true, review })
  } catch (err) {
    console.error('[guiReview]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

const verifyReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.json({ success: false })
    }

    const localHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        `${review.orderID.toString()}-${review.user.toString()}-${review.content}`
      )
    )

    const chainData = await contract.getReviewByOrder(
      review.orderID.toString()
    )

    const chainHash = chainData[1]

    console.log('localHash:', localHash)
    console.log('chainHash:', chainHash)

    const verified =
      localHash.toLowerCase() === chainHash.toLowerCase()

    res.json({
      success: verified,
      localHash,
      chainHash
    })

  } catch (err) {
    console.error('[verifyReview]', err)
    res.json({ success: false })
  }
}

module.exports = {
  detail,
  buy,
  review,
  verifyReview
}
