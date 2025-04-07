"use strict";

var express = require("express");

var _require = require("../controllers/payoutController"),
    createPayoutRequest = _require.createPayoutRequest,
    getOwnerPayoutRequests = _require.getOwnerPayoutRequests,
    getPayoutById = _require.getPayoutById,
    getAllPayoutRequests = _require.getAllPayoutRequests,
    updatePayoutStatus = _require.updatePayoutStatus; // const { getAllPayoutRequests } = require("../controllers/payoutController");


var payoutRouter = express.Router(); // payoutRouter.post("/payouts/request", isAuthenticated, isOwner, requestPayout);

payoutRouter.post("/request", createPayoutRequest); // ✅ Owner views all their payout requests (history)

payoutRouter.get("/my-requests", getOwnerPayoutRequests); // ✅ Owner views a single payout detail (Optional)

payoutRouter.get("/:payoutId", getPayoutById);
/* --------------------------------------
 🛡️ ADMIN ROUTES
-------------------------------------- */
// payoutRouter.get("/admin/requests", isAuthenticated, isAdmin, getAllPayoutRequests);

payoutRouter.get("/", getAllPayoutRequests); // ✅ Admin approves a payout request

payoutRouter.patch("/:payoutId", updatePayoutStatus); // ✅ Admin views a single payout detail
// payoutRouter.get("/admin/:payoutId",  getPayoutById);

module.exports = payoutRouter;