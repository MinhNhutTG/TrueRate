const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'blockrate_secret_key'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 ngày (ms)

// Tạo access token
const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })

// Gắn token vào cookie httpOnly + trả về JSON
const sendTokenResponse = (res, user, statusCode = 200) => {
  const token = signToken({ id: user._id, role: user.role })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })

  // Không trả password ra ngoài
  user.password = undefined

  return res.status(statusCode).json({
    success: true,
    token,
    user,
  })
}

// Verify token, trả về payload hoặc null
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

module.exports = { signToken, sendTokenResponse, verifyToken }