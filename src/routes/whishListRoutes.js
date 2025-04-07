const express = require("express");
const { addToWishlist, removeFromWishlist, getUserWishlist } = require("../controllers/whishListController");
const wishListRouter = express.Router();
// ✅ Add to Wishlist
wishListRouter.post("/add", addToWishlist);

wishListRouter.post("/remove", removeFromWishlist);

wishListRouter.get("/:userId", getUserWishlist);


module.exports = wishListRouter;
