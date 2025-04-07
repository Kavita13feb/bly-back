// /admin/verify-boat-owner


const express = require('express');
const { registerAdmin, loginAdmin, getAdminDashboardStats } = require('../controllers/adminController');
const { authorise } = require('../middlewares/authorise');
const authenticate = require('../middlewares/authenticate');
const { isAdmin } = require('../middlewares/verifyAdmin');
const adminRouter = express.Router()



adminRouter.post('/register', registerAdmin);
adminRouter.post('/login', loginAdmin);

// adminRouter.get("/", authorise["b"], getAllUsers);
// adminRouter.use(authenticate)
///isAdmin
adminRouter.get("/dashboard-stats", getAdminDashboardStats);

adminRouter.get("/dashboard", authorise(["b"]), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});


module.exports = adminRouter;
