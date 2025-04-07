const express = require("express");
const { createPayoutRequest, getOwnerPayoutRequests, getPayoutById, getAllPayoutRequests, updatePayoutStatus } = require("../controllers/payoutController");
// const { getAllPayoutRequests } = require("../controllers/payoutController");

const payoutRouter = express.Router();


// payoutRouter.post("/payouts/request", isAuthenticated, isOwner, requestPayout);
payoutRouter.post("/request",  createPayoutRequest);

// ✅ Owner views all their payout requests (history)
payoutRouter.get("/my-requests",  getOwnerPayoutRequests);

// ✅ Owner views a single payout detail (Optional)
payoutRouter.get("/:payoutId", getPayoutById);


/* --------------------------------------
 🛡️ ADMIN ROUTES
-------------------------------------- */


// payoutRouter.get("/admin/requests", isAuthenticated, isAdmin, getAllPayoutRequests);

payoutRouter.get("/",  getAllPayoutRequests);

// ✅ Admin approves a payout request
payoutRouter.patch("/:payoutId",  updatePayoutStatus);


// ✅ Admin views a single payout detail
// payoutRouter.get("/admin/:payoutId",  getPayoutById);
module.exports = payoutRouter;

