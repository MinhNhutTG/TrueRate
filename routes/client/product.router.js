const express = require("express");
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware')
const controller = require("../../controllers/client/product.controller");



router.post("/buy/:id", protect, controller.buy)
router.post("/review/:id", protect, controller.review)
router.get("/:id", controller.detail);
module.exports = router;