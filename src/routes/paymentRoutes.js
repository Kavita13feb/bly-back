const express = require("express");
const { 
  initiatePayment, 
  verifyPayment, 
  getUserPayments, 
  getUserPaymentById, 
  getAllPayments, 
  getPaymentDetails, 
  getAllTransactions, 
  getTransactionById, 
  initiateRefund, 
  getAllRefunds, 
  updateRefundStatus 
} = require("../controllers/paymentController");

// const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const paymentRouter = express.Router();

// ✅ User Payment Routes
// paymentRouter.post("/initiate", isAuthenticated, initiatePayment);
// paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/my-payments", isAuthenticated, getUserPayments);
paymentRouter.get("/my-payments/:paymentId", isAuthenticated, getUserPaymentById);

// ✅ Admin Payment & Transactions
paymentRouter.get("/admin/payments", isAuthenticated, isAdmin, getAllPayments);
paymentRouter.get("/admin/payments/:paymentId", isAuthenticated, isAdmin, getPaymentDetails);
paymentRouter.get("/admin/transactions", isAuthenticated, isAdmin, getAllTransactions);
paymentRouter.get("/admin/transactions/:txnId", isAuthenticated, isAdmin, getTransactionById);

// ✅ Refund Handling
paymentRouter.post("/refund/:paymentId", isAuthenticated, initiateRefund); // Admin/User
paymentRouter.get("/admin/refunds", isAuthenticated, isAdmin, getAllRefunds);
paymentRouter.patch("/admin/refunds/:refundId", isAuthenticated, isAdmin, updateRefundStatus);

module.exports = paymentRouter;
