const PayoutModel = require("../models/payoutModel");
const crypto = require('crypto');

const generateReferenceId = () => {
  return "PAYOUT-" + crypto.randomBytes(5).toString("hex").toUpperCase(); // Example: PAYOUT-AB12CD34E
};

const calculateOwnerBalance = async (ownerId) => {
     const completedBookings = await BookingModel.find({
       ownerId,
       status: "Completed",
       isPaidOut: false,
     });
   
     const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.ownerEarning, 0);
     return totalEarnings;
   };
   
// 📌 1. Create Payout Request (Owner)
const createPayoutRequest = async (req, res) => {
     try {
       const { amount, note } = req.body;
   
       // ✅ Find owner profile linked to authenticated user
       const owner = await BoatOwnerModel.findOne({ userId: req.userId });
       if (!owner) {
         return res.status(404).json({ message: "Owner profile not found." });
       }
   
       if (!amount || amount <= 0) {
         return res.status(400).json({ message: "Invalid payout amount." });
       }
   
       // ✅ Calculate available balance
       const completedBookings = await BookingModel.find({
         ownerId: owner._id, // ✅ Use owner._id here
         status: "Completed",
         isPaidOut: false,
       });
   
       const availableBalance = completedBookings.reduce((sum, booking) => sum + booking.ownerEarning, 0);
       const bookingIds = completedBookings.map((b) => b._id); // Collect bookings for payout
   
       // ✅ Validate amount
       if (amount > availableBalance) {
         return res.status(400).json({ message: "Requested amount exceeds available balance." });
       }
   
       // ✅ Generate reference ID
       const generateReferenceId = () => {
         return "PAYOUT-" + crypto.randomBytes(5).toString("hex").toUpperCase();
       };
   
       // ✅ Create payout request
       const payout = await PayoutModel.create({
         ownerId: owner._id, // Correct ownerId
         amount,
         note,
         referenceId: generateReferenceId(),
         bookingIds, // Add booking references
         status: "Pending",
       });
   
       res.status(201).json({ message: "Payout request created successfully.", payout });
     } catch (error) {
       console.error("Error creating payout:", error);
       res.status(500).json({ message: "Internal server error." });
     }
   };
   


// 📌 2. Get All Payout Requests for Logged-in Owner
const getOwnerPayoutRequests = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const payouts = await PayoutModel.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(payouts);
  } catch (error) {
    console.error("Error fetching owner's payouts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// 📌 3. Get a Single Payout by ID (Owner)
const getPayoutById = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const payout = await PayoutModel.findById(payoutId);

    if (!payout) return res.status(404).json({ message: "Payout not found." });
    res.status(200).json(payout);
  } catch (error) {
    console.error("Error fetching payout by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


/* ========================================================
 ✅ ADMIN CONTROLLERS
======================================================== */

// 📌 4. Admin: Get All Payout Requests (Filtered)
const getAllPayoutRequests = async (req, res) => {
     try {
       // ✅ Extract query params with default fallbacks
       let { page = 1, limit = 10, status, sortBy = "createdAt", order = "desc", search  } = req.query;
   
       page = parseInt(page);
       limit = parseInt(limit);
       order = order === "asc" ? 1 : -1; // MongoDB sorting order
      
       // ✅ Filter logic
       const filters = {};
       if (status) filters.status = status;

       // Add search filter for owner name/email if search term provided
       if (search) {
        
         filters.$or = [
           { 'ownerName': { $regex: search, $options: 'i' } },
          
         ];
       }

       // ✅ Total count for pagination
       const totalPayouts = await PayoutModel.countDocuments(filters);
   
       // ✅ Fetch payouts with pagination, sorting, and owner population
       const payouts = await PayoutModel.find(filters)
         .populate("ownerId", "name email contact profilePic")
         .sort({ [sortBy]: order })
         .skip((page - 1) * limit)
         .limit(limit)
         .lean(); // To optimize performance
  //  console.log(payouts)
       // ✅ Format for frontend
       const formattedPayouts = payouts.map((payout) => ({
          id: payout._id, // Internal payout id
          reference: payout.reference || "N/A", // Reference for admin tracking
          amount: `$${payout.amount?.toLocaleString() || 0}`, // Amount formatted with $ and commas
          status: payout.status, // e.g., Pending, Approved, Rejected
          date: payout.requestedAt ? payout.requestedAt.toISOString().split("T")[0] : "N/A", // Request date in YYYY-MM-DD
          txnId: payout.txnId || "N/A", // Transaction ID when marked as paid
          note: payout.note || "", // Owner's note on payout request
          processedAt: payout.processedAt ? payout.processedAt.toISOString().split("T")[0] : "N/A", // Date when processed (approved/rejected)
          bookingIds: payout.bookingIds?.length > 0 ? payout.bookingIds.map(id => id.toString()) : [], // Array of Booking IDs (stringified)
          owner: {
            name: payout.ownerId?.name || "N/A",
            email: payout.ownerId?.email || "N/A",
            contact: payout.ownerId?.contact || "N/A",
            profileImg: payout.ownerId?.profilePic || "https://randomuser.me/api/portraits/men/10.jpg", // Fallback image
          }
        }));
        
   
       // ✅ Return data with pagination info
       res.status(200).json({
         total: totalPayouts,
         page,
         totalPages: Math.ceil(totalPayouts / limit),
         limit,
         data: formattedPayouts,
       });
     } catch (error) {
       console.error("Error fetching payout requests:", error);
       res.status(500).json({ message: "Internal server error." });
     }
   };
   
// 📌 5. Admin: Approve/Reject/Mark Paid a Payout (Single Dynamic Route)
const updatePayoutStatus = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { status, txnId, adminNote } = req.body;
// console.log(status,txnId,adminNote)
//     if (!["Approved", "Declined", "Paid","Hold"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

    const updateData = {
      status: status.status,
      adminNote: adminNote || "",
    };

    if (status.status === "Paid") {
      if (!txnId) {
        return res.status(400).json({ message: "Transaction ID is required for marking as Paid." });
      }
      updateData.txnId = txnId;
      updateData.processedAt = new Date();
    }

    const updatedPayout = await PayoutModel.findByIdAndUpdate(payoutId, { $set: updateData }, { new: true });
    console.log(updatedPayout)
    if (!updatedPayout) return res.status(404).json({ message: "Payout not found." });

    res.status(200).json({ message: "Payout updated successfully.", payout: updatedPayout });
  } catch (error) {
    console.error("Error updating payout status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createPayoutRequest,
  getOwnerPayoutRequests,
  getPayoutById,
  getAllPayoutRequests,
  updatePayoutStatus,
};
