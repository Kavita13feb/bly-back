const BookingModel = require("../models/bookingModel");


const  saveBookingData = async (bookingDetails) => {
  try {
    // let bookingDetailsWithId = { ...bookingDetails, owne };
    // console.log(bookingDetails, bookingDetailsWithId);
console.log(bookingDetails)
//validation require no same time booking should be stored 
    const bookingList = await BookingModel(bookingDetails);
    await bookingList.save();
    return bookingList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOwnerBookings = async (ownerId,boatId) => {
  try {
   
  
    const bookingList = await BookingModel.find({ownerId,boatId});

    return bookingList;
  } catch (error) {
    console.log(error);
  }
};

const getBookingDetails = async (bookingId) => {
  try {
    const bookingList = await BookingModel.findOne({ _id: bookingId });

    return bookingList;
  } catch (error) {
    console.log(error);
  }
};
const editBookingData = async (bookingId, bookingDetails) => {
  try {
    const bookingList = await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      bookingDetails
    );

    return bookingList;
  } catch (error) {
    console.log(error);
  }
};

const deleteBookingData = async (bookingId) => {
  try {
    const bookingList = await BookingModel.findByIdAndDelete(bookingId);

    return bookingList;
  } catch (error) {
    console.log(error);
  }
};

const getBoatBookings = async (boatId) => {

  try {
   
    const bookings = await BookingModel.find(boatId);

    return bookings
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
    saveBookingData,
    getBoatBookings,
    getOwnerBookings,
    getBookingDetails,
    editBookingData,
    deleteBookingData
};
