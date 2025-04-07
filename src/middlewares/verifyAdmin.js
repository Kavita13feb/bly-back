const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admins Only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
