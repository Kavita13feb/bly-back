const WishListModel = require("../models/wishListModel");

exports.addToWishlist = async (req, res) => {
  const { userId, yachtId } = req.body;
  console.log(userId)
  try {
    const existingItem = await WishListModel.findOne({ userId, yachtId });
    if (existingItem) {
      return res.status(400).json({ message: "Already in Wishlist" });
    }

    const wishlistItem = new WishListModel({ userId, yachtId });
    await wishlistItem.save();

    res.json({ message: "Added to Wishlist", wishlistItem });
  } catch (error) {
     console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { userId, yachtId } = req.body;

  try {
    await WishListModel.findOneAndDelete({ userId, yachtId });
    res.json({ message: "Removed from Wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await WishListModel.find({ userId }).populate("yachtId"); 
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
