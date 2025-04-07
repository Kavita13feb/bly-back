  const boatModel = require("../models/boatModel");
const bookingModel = require("../models/bookingModel");
const PaymentModel = require("../models/PaymentModel");
const UserModel = require("../models/userModel");
const {
  saveBookingData,
  getBoatBookings,
  getOwnerBookings,
  getBookingDetails,
  editBookingData,
  deleteBookingData,
} = require("../repositories/bookingsRepository");
const {
  CreateCheckoutSession,
  getSessionDetails,
} = require("../services/stripeService");
const crypto = require("crypto");

const generateIds = (type) => {
  return `${type}-` + crypto.randomBytes(4).toString("hex").toUpperCase();
};

// const addBooking = async (req, res) => {
//   console.log("addBooking");
//   try {
//     const {
//       yachtId,
//       startDate,
//       endDate,
//       startTime,
//       endTime,
//       tripDuration,
//       groupSize,
//       maxCapacity,
//       pricing,
//       amount,
//       occasion,
//       instabookId,
//       userId,
//       exchangeRate=1,
//     } = req.body;
//     // console.log(req.body);
//     // const userId = "671cfe89a108e0747a02a788";
//     console.log(userId)
//     const owner = await BoatOwnerModel.findOne({ userId });
//     if (!owner) {
//       return res.status(404).json({ message: "Boat owner not found" });
//     }
//     console.log(owner)
   

//     const newBooking = new bookingModel({
//       userId,
//       yachtId,
//       startDate,
//       endDate,
//       startTime,
//       endTime,
//       tripDuration,
//       groupSize,
//       maxCapacity,
//       pricing,
//       bookingRef: generateIds("YB"),

//       txnId: generateIds("TXN"),
//       occasion,
//       amount,
//       exchangeRate: exchangeRate || 1,
//       ownerId: owner._id,
//       status: "pending",
//     });

//     console.log("newBooking",newBooking);

//     const savedBooking = await newBooking.save();
//     console.log(savedBooking);

//     const user = await UserModel.findById({ _id: userId });
//     console.log(user);

//     const session = await CreateCheckoutSession(
//       user.email,
//       pricing,
//       savedBooking._id,
//       savedBooking.bookingRef,
//       instabookId,
//       yachtId
//     );

//     // const updatedBooking = await bookingModel.findByIdAndUpdate(
//     //   { _id: savedBooking._id },
//     //   { status :"Completed"},
//     //   { new: true } // Return the updated document
//     // );
//     // console.log(session)
//     if (session) {
//       const newPayment = new PaymentModel({
//         bookingId: savedBooking._id,
//         userId: userId,
//         currency: "usd",
//         txnId: savedBooking.txnId,
//         amountPaid: amount || pricing.totals.totalRenterPayment,
//         sessionId: session.id,
//         totalAmount: pricing.totals.totalRenterPayment,
//         amount: amount || pricing.totals.totalRenterPayment,
//         partialPayments: [
//           {
//             amount: 0,
//             method: "Card",
//             status: "pending",
//           },
//         ],
//         paymentStatus: "pending",
//         ownerPayoutDetails: {
//           payoutAmount: pricing.totals.totalPayout,
//           payoutCurrency: "USD",
//           exchangeRate: exchangeRate||1,
//         },
//         exchangeRate: exchangeRate || 1,
//         status: "pending",
//       });
//       const savedPayment = await newPayment.save();
//      await bookingModel.findByIdAndUpdate(savedBooking._id, { paymentId: savedPayment._id }, { new: true });
//       res.status(201).json({ url: session.url });
//     } else {
//       res.status(400).json({ error: "try again" });
//     }
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const addBooking = async (req, res) => {
  console.log("addBooking");
  try {
    const {
      yachtId,
      ownerId,
      startDate,
      endDate,
      startTime,
      endTime,
      tripDuration,
      groupSize,
      maxCapacity,
      pricing,
      amount,
      occasion,
      instabookId,
      userId,
      exchangeRate = 1,
      name,
      email,
      phone
    } = req.body;

    let user;
    let owner;
console.log("body",req.body) 
    if (!userId) {
     
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Guest booking requires name, email, and phone." });
      }

      // Check if user exists with the same email or phone number
      user = await UserModel.findOne({ $or: [{ email }, { phone }] });
console.log("user",user)
      if (user) {
        if (user.email !== email || user.phone !== phone) {
          return res.status(400).json({ message: "Email or phone number conflict. Please log in or use a different contact." });
        }
      } else {
        // Create a new user as a guest
        user = new UserModel({
          name,
          email,
          phone,
          role: "g",
          isGuest: true,
        });
        await user.save();
      }
    } else {
      // Fetch existing user by userId
      user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update phone number if not already present
      if (!user.phone && phone) {
        user.phone = phone;
        await user.save();
      }

      // Validate user data consistency
      if ((email && user.email !== email) || (phone && user.phone !== phone)) {
        return res.status(400).json({ message: "User data conflict. Please log in or use consistent contact details." });
      }
    }

   

    const newBooking = new bookingModel({
      userId: user._id,
      yachtId,
      startDate,
      endDate,
      startTime,
      endTime,
      tripDuration,
      groupSize,
      maxCapacity,
      pricing,
      bookingRef: generateIds("YB"),
      txnId: generateIds("TXN"),
      occasion,
      amount,
      exchangeRate: exchangeRate || 1,
      ownerId,
      status: "pending",
    });

    console.log("New Booking:", newBooking);

    const savedBooking = await newBooking.save();
    console.log("Saved Booking:", savedBooking);

    const session = await CreateCheckoutSession(
      user.email,
      pricing,
      savedBooking._id,
      savedBooking.bookingRef,
      instabookId,
      yachtId
    );
console.log("session",session)
    if (session) {
      const newPayment = new PaymentModel({
        bookingId: savedBooking._id,
        userId: user._id,
        ownerId,
        currency: "usd",
        txnId: savedBooking.txnId,
        amountPaid: amount || pricing.totals.totalRenterPayment,
        sessionId: session.id,
        totalAmount: pricing.totals.totalRenterPayment,
        amount: amount || pricing.totals.totalRenterPayment,
        partialPayments: [
          {
            amount: 0,
            method: "Card",
            status: "pending",
          },
        ],
        paymentStatus: "pending",
        ownerPayoutDetails: {
          payoutAmount: pricing.totals.totalPayout,
          payoutCurrency: "USD",
          exchangeRate: exchangeRate || 1,
        },
        exchangeRate: exchangeRate || 1,
        status: "pending",
      });
      
      const savedPayment = await newPayment.save();
      await bookingModel.findByIdAndUpdate(savedBooking._id, { paymentId: savedPayment._id }, { new: true });

      res.status(201).json({ url: session.url });
    } else {
      console.log("session not found")
      res.status(400).json({ error: "try again" });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateBooking = async (req, res) => {
  const { bookingId } = req.params; // Booking ID
  let { status } = req.body; // New status
  // Convert status to lowercase for consistency
  // Get all fields to update from request body
  const updateFields = { ...req.body };
  console.log(bookingId)
  
  if (updateFields.status) {

    status = status.toLowerCase();  
  }

  try {
    // Validate the new status
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    // Find the booking first to validate it exists
    const booking = await bookingModel.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Convert status to lowercase if it exists in updateFields
    if (updateFields.status) {
      updateFields.status = updateFields.status.toLowerCase();
    }
    // Format only the specific booking details that we update
    const formattedUpdateFields = {
      startDate: updateFields.startDate ? new Date(updateFields.startDate) : booking.startDate,
      bookingRef: updateFields.id || booking.bookingRef,
      userName: updateFields.user || booking.userName,
      yachtTitle: updateFields.yacht || booking.yachtTitle,
      pricing: updateFields.amount ? {
        ...booking.pricing,
        totals: {
          ...booking.pricing?.totals,
          totalRenterPayment: parseFloat(updateFields.amount.replace('$', '').replace(',', ''))
        }
      } : booking.pricing,
      status: updateFields.status ? updateFields.status.toLowerCase() : booking.status
    };

    // Remove any undefined values from formatted fields
    Object.keys(formattedUpdateFields).forEach(key => {
      if (formattedUpdateFields[key] === undefined) {
        delete formattedUpdateFields[key];
      }
    });

    // Update updateFields with formatted data
    Object.assign(updateFields, formattedUpdateFields);
    // Update all valid fields from the request body
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Failed to update booking" });
    }

    // If status is being updated to cancelled, we may want to handle refunds etc
    if (updateFields.status === 'cancelled') {
      // TODO: Handle cancellation logic like refunds
      console.log('Booking cancelled - handle refund flow');
    }
    // Update the booking status
    // const updatedBooking = await bookingModel.findByIdAndUpdate(
    //   { _id: bookingId },
    //   { status },
    //   { new: true } // Return the updated document
    // );

    // if (!updatedBooking) {
    //   return res.status(404).json({ message: "Booking not found" });
    // }
console.log(updatedBooking)
    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addBookingsController = async (req, res, next) => {
  try {
    const BookingDetails = req.body;

    const booking = await saveBookingData(BookingDetails);

    res.status(200).send({ status: "success", booking });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getBookingsController = async (req, res) => {
  try {
    const boatId = req.params;

    const bookings = await getBoatBookings(boatId);

    res.status(200).send({ status: "success", bookings });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOwnerBookingsController = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { boatId } = req.params;
    const bookings = await getOwnerBookings(ownerId, boatId);

    res.status(200).send(bookings);
  } catch (error) {
    console.log(error);
  }
};

const getBookingDeatilsController = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingDetails(bookingId);

    res.status(200).send({ status: "success", booking });
  } catch (error) {
    console.log(error);
  }
};

const editBookingController = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const list = await editBookingData(bookingId, req.body);

    res.status(200).send({ message: "booking updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getBookingDeatilsBySessionId = async (req, res) => {
  const { session_id } = req.query;
  console.log(session_id);
  try {
    const bookingDetails = await getSessionDetails(session_id);
    res.status(200).send(bookingDetails);
  } catch (error) {
    console.log(error);
  }
};
const deleteBookingController = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await deleteBookingData(bookingId);

    res.status(200).send({ message: "booking deleted successfully", booking });
  } catch (error) {
    console.log(error);
  }
};

// const getAllBookings = async (req, res) => {
//   try {
//     const { page = 1, limit = 5, sort = "createdAt", order = "desc", status, userId, yachtId, startDate, endDate } = req.query;

//     const filters = {};

//     // ✅ Filter by Status
//     if (status) filters.status = status;

//     // ✅ Filter by User (User ID)
//     if (userId) filters.userId = userId;

//     // ✅ Filter by Yacht (Yacht ID)
//     if (yachtId) filters.yachtId = yachtId;

//     // ✅ Filter by Date Range (Start Date - End Date)
//     if (startDate && endDate) {
//       filters.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }

//     // ✅ Fetch Paginated Data
//     const bookings = await bookingModel.find(filters)
//       .sort({ [sort]: order === "desc" ? -1 : 1 }) // ✅ Sorting (default: newest first)
//       .skip((page - 1) * limit) // ✅ Pagination
//       .limit(parseInt(limit))
//       .populate("userId", "name email") // ✅ Populate User Info
//       .populate("yachtId", "title location") // ✅ Populate Yacht Info
//       .populate("paymentId", "txnId")
//       .lean();

//       const formattedBookings = bookings.map((booking) => ({
//         id: booking.bookingRef,
//         user: booking.userId.name,
//         yacht: booking.yachtId.title,
//         status: booking.status,
//         amount: booking.pricing.totals.totalRenterPayment || "N/A",
//         txnId: booking.paymentId?.txnId || booking.txnId, // ✅ If no payment yet, show "Pending"
//         createdAt: booking.createdAt.toISOString().split("T")[0], // ✅ Format Date (YYYY-MM-DD)
//       }));

//     // ✅ Get Total Count for Pagination
//     const total = await bookingModel.countDocuments(filters);

//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit),
//       limit: parseInt(limit),
//       data: formattedBookings,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching bookings:", error);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };

const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort = "createdAt",
      order = "desc",
      status,
      userId,
      yachtId,
      startDate,
      endDate,
      search,
    } = req.query;

    const filters = {};
console.log(sort)
    // ✅ Filter by Status
    if (status) filters.status = new RegExp(`^${status}$`, "i");

    // ✅ Filter by User (User ID)
    if (userId) filters.userId = userId;

    // ✅ Filter by Yacht (Yacht ID)
    if (yachtId) filters.yachtId = yachtId;

    // ✅ Filter by Date Range (Start Date - End Date)
    if (startDate && endDate) {
      filters.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive
      filters.$or = [
        { userName: regex },
        { yachtTitle: regex },
        { ownerName: regex },
        { "location.city": regex },
        { "location.country": regex },
      ];
    }
    // ✅ Fetch Paginated Data
    const bookings = await bookingModel
      .find(filters)
      .sort({ ["startDate"]: order === "desc" ? -1 : 1 }) // ✅ Sorting
      .skip((page - 1) * limit) // ✅ Pagination
      .limit(parseInt(limit))

      .populate("paymentId", "txnId") // ✅ Populate Payment Info
      .lean();

    // ✅ Formatted Output for Frontend
    const formattedBookings = bookings.map((booking) => ({
      id: booking?.bookingRef||"",
      _id: booking._id,
      user: booking.userName || "N/A",
      yacht: booking.yachtTitle || "N/A",
      owner: booking.ownerName || "N/A",
      tripDate: new Date(booking.startDate).toISOString().split("T")[0],
      startDate: new Date(booking.startDate).toISOString().split("T")[0],
      endDate: new Date(booking.endDate).toISOString().split("T")[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      tripDuration: booking.tripDuration,
      groupSize: booking.groupSize,
      maxCapacity: booking.maxCapacity,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      specialRequest: booking.specialRequest || "N/A",
      occasion: booking.occasion || "N/A",
      isCaptained: booking.captained ? "Yes" : "No",
      pricing: {
        baseCost: booking.pricing?.baseCost || 0,
        captainCost: booking.pricing?.captainCost || 0,
        totalPayout: booking.pricing?.totals?.totalPayout || 0,
        totalRenterPayment: booking.pricing?.totals?.totalRenterPayment || 0,
        serviceCharge: booking.pricing?.totals?.serviceCharge || 0,
        paymentServiceCharge:
          booking.pricing?.totals?.paymentServiceCharge || 0,
      },
      amount: `$${
        booking.pricing?.totals?.totalRenterPayment?.toLocaleString() || booking.price ||0
      }`,
      txnId: booking.paymentId?.txnId || booking.txnId || "Pending",
      refundDetails: booking.refundDetails || null,
      bookingDate: booking.createdAt.toISOString().split("T")[0], // Format Date (YYYY-MM-DD)
    }));

    // ✅ Total Count for Pagination
    const total = await bookingModel.countDocuments(filters);

    // ✅ Final Response
    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit),
      data: formattedBookings,
    });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

module.exports = {
  getAllBookings,
  addBooking,
  updateBooking,
  addBookingsController,
  getBookingsController,
  getOwnerBookingsController,
  getBookingDeatilsController,
  editBookingController,
  deleteBookingController,
  getBookingDeatilsBySessionId,
};
