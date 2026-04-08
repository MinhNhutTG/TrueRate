const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,          // ← cho phép nhiều user không có email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
      select: false,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,          // ← cho phép nhiều user không có ví
      lowercase: true,
      trim: true,
    },
    nonce: {
      type: String,
      default: null,
      select: false,         // ← không trả ra ngoài khi query bình thường
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
)

// Hash password trước khi lưu (chỉ khi có password)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 12)
})

// So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema, 'Users')