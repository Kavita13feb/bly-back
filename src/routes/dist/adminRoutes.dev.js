"use strict";

// /admin/verify-boat-owner
var express = require('express');

var _require = require('../controllers/adminController'),
    registerAdmin = _require.registerAdmin,
    loginAdmin = _require.loginAdmin,
    getAdminDashboardStats = _require.getAdminDashboardStats;

var _require2 = require('../middlewares/authorise'),
    authorise = _require2.authorise;

var authenticate = require('../middlewares/authenticate');

var _require3 = require('../middlewares/verifyAdmin'),
    isAdmin = _require3.isAdmin;

var adminRouter = express.Router();
adminRouter.post('/register', registerAdmin);
adminRouter.post('/login', loginAdmin); // adminRouter.get("/", authorise["b"], getAllUsers);
// adminRouter.use(authenticate)
///isAdmin

adminRouter.get("/dashboard-stats", getAdminDashboardStats);
adminRouter.get("/dashboard", authorise(["b"]), function (req, res) {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});
module.exports = adminRouter;