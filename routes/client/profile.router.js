const { protectPage } = require('../../middleware/auth.middleware')
const express = require("express");
const router = express.Router();
const controller = require('../../controllers/client/profile.controller')

router.get('/purchased-list', protectPage, controller.purchasedList)

module.exports = router;