const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/auth.controller')

// Pages
router.get('/login',    controller.showLogin)
router.get('/register', controller.showRegister)

// Email / password
router.post('/api/auth/login',    controller.login)
router.post('/api/auth/register', controller.register)
router.post('/api/auth/logout',   controller.logout)

// MetaMask
router.get('/api/auth/nonce',     controller.getNonce)      // ← mới
router.post('/api/auth/wallet',   controller.walletLogin)   // ← mới

module.exports = router