// authMiddleware.js
const admin = require("../config/firebaseAdmin");
const UserModel = require("../models/userModel");



 const authenticate = async (req, res, next) => {

  try {
    const idToken = req.headers.authorization?.split(" ")[1];
console.log(idToken)
    if (!idToken) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = decodedToken.email;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = decodedToken;
    req.userrole = user.role;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};
module.exports = authenticate;
