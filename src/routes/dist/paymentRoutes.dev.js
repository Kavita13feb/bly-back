"use strict";

var express = require("express");

var _require = require("../controllers/paymentController"),
    initiatePayment = _require.initiatePayment,
    verifyPayment = _require.verifyPayment,
    getUserPayments = _require.getUserPayments,
    getUserPaymentById = _require.getUserPaymentById,
    getAllPayments = _require.getAllPayments,
    getPaymentDetails = _require.getPaymentDetails,
    getAllTransactions = _require.getAllTransactions,
    getTransactionById = _require.getTransactionById,
    initiateRefund = _require.initiateRefund,
    getAllRefunds = _require.getAllRefunds,
    updateRefundStatus = _require.updateRefundStatus; // const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");


var paymentRouter = express.Router(); // ✅ User Payment Routes
// paymentRouter.post("/initiate", isAuthenticated, initiatePayment);
// paymentRouter.post("/verify", verifyPayment);

paymentRouter.get("/my-payments", isAuthenticated, getUserPayments);
paymentRouter.get("/my-payments/:paymentId", isAuthenticated, getUserPaymentById); // ✅ Admin Payment & Transactions

paymentRouter.get("/admin/payments", isAuthenticated, isAdmin, getAllPayments);
paymentRouter.get("/admin/payments/:paymentId", isAuthenticated, isAdmin, getPaymentDetails);
paymentRouter.get("/admin/transactions", isAuthenticated, isAdmin, getAllTransactions);
paymentRouter.get("/admin/transactions/:txnId", isAuthenticated, isAdmin, getTransactionById); // ✅ Refund Handling

paymentRouter.post("/refund/:paymentId", isAuthenticated, initiateRefund); // Admin/User

paymentRouter.get("/admin/refunds", isAuthenticated, isAdmin, getAllRefunds);
paymentRouter.patch("/admin/refunds/:refundId", isAuthenticated, isAdmin, updateRefundStatus);
module.exports = paymentRouter;