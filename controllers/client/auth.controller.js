const crypto = require('crypto')
const { ethers } = require('ethers')
const User = require('../../models/user.model')
const { sendTokenResponse } = require('../../utils/Jwt.util')

// ─── PAGES ──────────────────────────────────────────────
const showLogin = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/')
  res.render('./client/pages/auth/login', { title: 'Đăng nhập', error: null })
}

const showRegister = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/')
  res.render('./client/pages/auth/register', { title: 'Đăng ký', error: null })
}

// ─── EMAIL / PASSWORD ────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })

    return sendTokenResponse(res, user)
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body
    if (!fullName || !email || !password)
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' })

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' })

    const user = await User.create({ fullName, email, password })
    return sendTokenResponse(res, user, 201)
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

const logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' })
  return res.status(200).json({ success: true, message: 'Đã đăng xuất' })
}

// ─── METAMASK ────────────────────────────────────────────

// [GET] /api/auth/nonce?address=0x...
// Trả về nonce ngẫu nhiên, tạo user mới nếu chưa có
const getNonce = async (req, res) => {
  try {
    const address = req.query.address?.toLowerCase()

    if (!address || !/^0x[0-9a-f]{40}$/.test(address))
      return res.status(400).json({ success: false, message: 'Địa chỉ ví không hợp lệ' })

    const nonce = crypto.randomBytes(16).toString('hex')

    let user = await User.findOne({ walletAddress: address }).select('+nonce')

    if (!user) {
      // Tạo user mới từ ví — chưa có email/password
      user = await User.create({
        walletAddress: address,
        fullName: `User_${address.slice(2, 8)}`,
        nonce,
      })
    } else {
      user.nonce = nonce
      await user.save()
    }

    return res.json({ success: true, nonce })
  } catch (err) {
    console.error('[getNonce]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}

// [POST] /api/auth/wallet  { address, signature }
// Verify chữ ký MetaMask → trả JWT như login thường
const walletLogin = async (req, res) => {
  try {
    const { address, signature } = req.body

    if (!address || !signature)
      return res.status(400).json({ success: false, message: 'Thiếu địa chỉ hoặc chữ ký' })

    const user = await User.findOne({ walletAddress: address.toLowerCase() }).select('+nonce')

    if (!user || !user.nonce)
      return res.status(401).json({ success: false, message: 'Vui lòng yêu cầu nonce trước' })

    // Message phải khớp chính xác với message hiển thị trong MetaMask popup
    const message = `Đăng nhập BlockRate\nNonce: ${user.nonce}`

    // ecrecover: lấy địa chỉ ví từ signature (không cần private key)
    const recovered = ethers.verifyMessage(message, signature).toLowerCase()

    if (recovered !== address.toLowerCase())
      return res.status(401).json({ success: false, message: 'Chữ ký không hợp lệ' })

    // Xoá nonce sau khi dùng — chống replay attack
    user.nonce = null
    await user.save()

    return sendTokenResponse(res, user)
  } catch (err) {
    console.error('[walletLogin]', err)
    return res.status(500).json({ success: false, message: 'Lỗi xác thực chữ ký' })
  }
}

module.exports = {
  showLogin, showRegister,
  login, register, logout,
  getNonce, walletLogin,
}