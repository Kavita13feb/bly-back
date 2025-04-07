const express = require('express');
const { getBookingsController, getBookingDeatilsController, addBookingsController, editBookingController, deleteBookingController, addBooking, updateBooking, getBookingDeatilsBySessionId, getAllBookings } = require("../controllers/bookingController");
const authenticate = require("../middlewares/authenticate");
const { authorise } = require('../middlewares/authorise');
const checkOwnership = require('../middlewares/checkOwnership');

const bookingRouter = express.Router()



//to show bookings or available dates in calender as well as for owner to get all bookings of a boat
bookingRouter.post('/', addBooking); 

bookingRouter.patch("/:bookingId", updateBooking);
bookingRouter.get('/',  getAllBookings); 

bookingRouter.get('/boat/:boatId', getBookingsController); 
bookingRouter.get('/session', getBookingDeatilsBySessionId); 

bookingRouter.get('/:bookingId', getBookingDeatilsController); 


// for owner users
// bookingRouter.use(authenticate)
bookingRouter.post('/:boatId', authorise(["b"]), addBookingsController);     // add offline bookings



// bookingRouter.patch('/:bookingId/', editBookingController);//for wrong offline deatils
bookingRouter.delete('/:bookingId', authorise(["b"]),deleteBookingController);

//admin




module.exports = bookingRouter;
