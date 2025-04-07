const express = require('express');
const { getAllVisitors, addVisitor, getVisitorTrends, getVisitorBookingInsights, getVisitorBookingAnalytics } = require('../controllers/visitorsController');
const VisitorRouter = express.Router();
// const {
//   generateBookingRefAPI,
//   generateTransactionRefAPI,
//   generateVisitorIdAPI
// } = require('../controllers/idController');

// Routes to generate unique IDs
// VisitorRouter.get('/booking-ref', generateBookingRefAPI);
// VisitorRouter.get('/transaction-ref', generateTransactionRefAPI);
VisitorRouter.get('/trends',getVisitorTrends );
// VisitorRouter.get('/booking-trends',getVisitorBookingInsights );
VisitorRouter.get('/', getAllVisitors);
VisitorRouter.post('/',addVisitor );

VisitorRouter.get("/analytics", getVisitorBookingAnalytics);



module.exports = VisitorRouter;
