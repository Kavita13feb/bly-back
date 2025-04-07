"use strict";

var express = require('express');

var _require = require("../controllers/bookingController"),
    getBookingsController = _require.getBookingsController,
    getBookingDeatilsController = _require.getBookingDeatilsController,
    addBookingsController = _require.addBookingsController,
    editBookingController = _require.editBookingController,
    deleteBookingController = _require.deleteBookingController,
    addBooking = _require.addBooking,
    updateBooking = _require.updateBooking,
    getBookingDeatilsBySessionId = _require.getBookingDeatilsBySessionId,
    getAllBookings = _require.getAllBookings;

var authenticate = require("../middlewares/authenticate");

var _require2 = require('../middlewares/authorise'),
    authorise = _require2.authorise;

var checkOwnership = require('../middlewares/checkOwnership');

var bookingRouter = express.Router(); //to show bookings or available dates in calender as well as for owner to get all bookings of a boat

bookingRouter.post('/', addBooking);
bookingRouter.patch("/:bookingId", updateBooking);
bookingRouter.get('/', getAllBookings);
bookingRouter.get('/boat/:boatId', getBookingsController);
bookingRouter.get('/session', getBookingDeatilsBySessionId);
bookingRouter.get('/:bookingId', getBookingDeatilsController); // for owner users
// bookingRouter.use(authenticate)

bookingRouter.post('/:boatId', authorise(["b"]), addBookingsController); // add offline bookings
// bookingRouter.patch('/:bookingId/', editBookingController);//for wrong offline deatils

bookingRouter["delete"]('/:bookingId', authorise(["b"]), deleteBookingController); //admin

module.exports = bookingRouter;