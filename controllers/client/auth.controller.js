const User = require('../../models/user.model')
const { sendTokenResponse } = require('../../utils/Jwt.util')
// load trang dang nhap
const showLogin = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/')
  res.render('./client/pages/auth/login', { title: 'Đăng nhập', error: null })
}
const showRegister = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/')
  res.render('./client/pages/auth/register', { title: 'Đăng ký', error: null })
}
// Dang nhap
const login = async (req, res) => {
  try {
    const { email, password } = req.body
 
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })
    }
 
    // select: false → phải select thủ công
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }
 
    return sendTokenResponse(res, user)
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}
// Dang ky 
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body
 
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' })
    }
 
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp' })
    }
 
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' })
    }
 
    const user = await User.create({ fullName, email, password })
 
    return sendTokenResponse(res, user, 201)
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
}
// Dang xuat
const logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' })
  return res.status(200).json({ success: true, message: 'Đã đăng xuất' })
}

module.exports = {showLogin, showRegister,login, register, logout}