const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");


router.get('/login', controller.showLogin)
router.get('/register', controller.showRegister)


// [POST ] /api/auth/login - xử lý đăng nhập, trả token + user info
router.post('/api/auth/login', controller.login)
// [POST] /api/auth/register - xử lý đăng ký, trả token + user info (có thể thêm sau)
router.post('/api/auth/register', controller.register)
// [POST] /api/auth/logout - xử lý đăng xuất (xóa cookie)
router.post('/api/auth/logout', controller.logout)

module.exports = router;