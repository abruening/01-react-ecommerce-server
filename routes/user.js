const express = require("express");

const router = express.Router();

const { authCheck } = require("../middleware/auth");

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);
router.post("/user/cart/coupon", authCheck, applyCouponUserCart);
router.post("/user/order", authCheck, createOrder);
router.post("/user/cash-order", authCheck, createCashOrder);
router.get("/user/orders", authCheck, orders);
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

// router.get("/user", (req, res) => {
//   res.json({ data: "hey you hit user API endpoint" });
// });

module.exports = router;
