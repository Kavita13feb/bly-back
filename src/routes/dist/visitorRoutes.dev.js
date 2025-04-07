"use strict";

var express = require('express');

var _require = require('../controllers/visitorsController'),
    getAllVisitors = _require.getAllVisitors,
    addVisitor = _require.addVisitor,
    getVisitorTrends = _require.getVisitorTrends,
    getVisitorBookingInsights = _require.getVisitorBookingInsights,
    getVisitorBookingAnalytics = _require.getVisitorBookingAnalytics;

var VisitorRouter = express.Router(); // const {
//   generateBookingRefAPI,
//   generateTransactionRefAPI,
//   generateVisitorIdAPI
// } = require('../controllers/idController');
// Routes to generate unique IDs
// VisitorRouter.get('/booking-ref', generateBookingRefAPI);
// VisitorRouter.get('/transaction-ref', generateTransactionRefAPI);

VisitorRouter.get('/trends', getVisitorTrends); // VisitorRouter.get('/booking-trends',getVisitorBookingInsights );

VisitorRouter.get('/', getAllVisitors);
VisitorRouter.post('/', addVisitor);
VisitorRouter.get("/analytics", getVisitorBookingAnalytics);
module.exports = VisitorRouter;