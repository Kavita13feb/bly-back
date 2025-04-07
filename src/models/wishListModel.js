const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Boat", required: true },
  
},{
     timestamps: true, 
     versionKey: false
   });

const WishListModel = mongoose.model("Wishlist", WishlistSchema);
module.exports= WishListModel;