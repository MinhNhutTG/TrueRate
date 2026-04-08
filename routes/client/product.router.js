const express = require("express");
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware')
const controller = require("../../controllers/client/product.controller");
const { moderateReview } = require("../../middleware/review-validation.middleware");


router.post("/buy/:id", protect, controller.buy)
router.post("/review/:id", protect, moderateReview, controller.review)
router.get("/:id", controller.detail);
router.get('/verify-review/:id', controller.verifyReview)
module.exports = router;