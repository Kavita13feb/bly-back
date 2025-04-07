const UserModel = require("../models/userModel");
const admin = require("../config/firebaseAdmin");
const functions = require("firebase-functions");

// const SupportTicket = require("../models/SupportTicket");
const bookingModel = require("../models/bookingModel");
const BoatModel = require("../models/boatModel");
const BoatOwnerModel = require("../models/boatOwnerModel");
const SupportTicketModel = require("../models/SupportTicketModel");

const NodeCache = require("node-cache");
const VisitorModel = require("../models/visitorsModel");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

// const registerAdmin = async (req, res) => {
//   const { email, password, name } = req.body;

//   if (!email || !password || !name) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if the user already exists in MongoDB
//     const existingUser = await UserModel.findOne({email});
//     console.log(existingUser)
//     if (existingUser) {

//         return res.status(400).json({
//           message: `This email is already registered as a ${existingUser.role}.`,
//         });
//     }

//     // Create the admin in Firebase Authentication
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       name,
//     });
// console.log(userRecord)
//     // Save the admin details in MongoDB
//     const adminData = {
//       uid: userRecord.uid, // Firebase UID
//       email: userRecord.email,
//       name: userRecord.displayName,
//       role: "a", // Role set to admin
//     };
//     const newAdmin = new UserModel(adminData); // Create a new instance
//     await newAdmin.save();

//     res
//       .status(201)
//       .json({ message: "Admin registered successfully", admin: adminData });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

const registerAdmin = functions.https.onRequest(async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  let userRecord = null;

  try {
    // Step 1: Check if the user already exists in MongoDB
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: `This email is already registered.`,
      });
    }

    // Step 2: Create the admin in Firebase Authentication
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const adminData = {
      uid: userRecord.uid, // Firebase UID
      email: userRecord.email,
      name: userRecord.displayName,
      role: "a", // Set role to admin
    };

    await UserModel.create(adminData);

    // Step 4: Respond with success if both Firebase and MongoDB succeed
    res.status(201).json({
      message: "Admin registered successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error during admin registration:", error);

    // Step 5: Rollback Firebase user creation if MongoDB operation fails
    if (userRecord && userRecord.uid) {
      try {
        await admin.auth().deleteUser(userRecord.uid); // Delete Firebase user
        console.log("Firebase user rollback successful.");
      } catch (rollbackError) {
        console.error("Error during Firebase user rollback:", rollbackError);
      }
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
const loginAdmin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID Token is required" });
  }

  try {
    // Step 1: Verify the Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Extract the email from the decoded token
    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({ message: "Invalid ID Token" });
    }

    // Step 2: Check if the user is an admin in MongoDB
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "a") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // Step 3: Respond with admin data
    res.status(200).json({
      admin: {
        id: user._id,
        //   uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: idToken, // Include the Firebase ID token
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

  
const getAdminDashboardStats = async (req, res) => {
     try {
    // **🚀 Check Cache First**
    // const cachedData = cache.get("dashboardStats");
    // if (cachedData) return res.status(200).json(cachedData);

    // **📌 Fetch Summary Stats & Trends in Parallel**
    const [
      totalBookings,
      totalYachtOwners,
      totalYachts,
      totalRevenue,
      recentBookings,
      pendingYachtApprovals,
      pendingOwnerApprovals,
      pendingTickets,
      resolvedTickets,
      bookingsTrend,
      revenueTrend,
      weekdayTrends,
      yachtOwnersTrend,
      yachtTrends,
      globalVisitorTracker,
      visitorWeeklyTrend 
    ] = await Promise.all([
      bookingModel.countDocuments(), // 🚀 Total Bookings
      UserModel.countDocuments({ role: "b" }), // 🚀 Total Yacht Owners
      BoatModel.countDocuments(), // 🚀 Total Yachts
      bookingModel.aggregate([
        { $group: { _id: null, revenue: { $sum: "$pricing.totals.totalRenterPayment" } } },
      ]), // 🚀 Total Revenue
 
      bookingModel
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("_id userId yachtId pricing.totals.totalRenterPayment  createdAt")
        .populate("userId", "name email") 
        .populate("yachtId", "title") 
        .lean(), // 🚀 Recent 3 Bookings
      BoatModel.find({ status: "pending_review" })
        .limit(3)
        .select("title ownerId status")
        .populate("ownerId", "name") // ✅ Populate owner details
        .lean(), // 🚀 Pending Yacht Approvals
      BoatOwnerModel.find({ approvalStatus: "pending" }) // ✅ Fetch pending yacht owners
        .limit(3)
        .select("name approvalStatus")
        .lean(), // 🚀 Pending Owner Approvals
      SupportTicketModel.countDocuments({ status: "Pending" }), // 🚀 Pending Support Tickets
      SupportTicketModel.countDocuments({ status: "Resolved" }), // 🚀 Resolved Support Tickets
     
  
      bookingModel.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // ✅ Use `createdAt` to track when bookings were made
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      bookingModel.aggregate([
        {
          $group: {
            _id: { $month: "$startDate" }, // ✅ Use `startDate` to track revenue when yacht is used
            revenue: { $sum: "$pricing.totals.totalRenterPayment" }, // ✅ Sum total payment
          },
        },
        { $sort: { _id: 1 } },
      ]),
      bookingModel.aggregate([
        { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
      ]),
      BoatOwnerModel.aggregate([
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
       { $sort: { _id: 1 } },
     ]), // 🚀 Yacht Owners Trend (Last 6 Months)
     BoatModel.aggregate([
       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
       { $sort: { _id: 1 } },
     ]),

      // **🚀 Global Visitor Tracker (Bookings by Region)**
      bookingModel.aggregate([
        { $group: { _id: "$region", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
    
      VisitorModel.aggregate([
        {
          $group: {
            _id: {
              $isoWeek: "$firstVisit"
            },
            newVisitors: { $sum: { $cond: ["$isReturning", 0, 1] } },
            returningVisitors: { $sum: { $cond: ["$isReturning", 1, 0] } }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 6 }
      ])
  


    ]);

    
    const formatTrend = (trendData, labels) => {
      const dataMap = new Map(trendData.map(t => [t._id, t.count || t.revenue])); // ✅ Handles both count & revenue
      return labels.map((label, index) => ({
        month: label,
        count: dataMap.get(index + 1) || 0
      }));
    };
    const formattedVisitorTrend = {
      labels: visitorWeeklyTrend.map((v, i) => `Week ${i + 1}`),
      newVisitors: visitorWeeklyTrend.map((v) => v.newVisitors),
      returningVisitors: visitorWeeklyTrend.map((v) => v.returningVisitors),
    };
    
    // 🚀 Get Current Month to Exclude Future Months
    const currentMonth = new Date().getMonth() + 1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 🚀 Format Trends Using Optimized Function
    const formattedBookingsTrend = formatTrend(bookingsTrend, monthNames);
    const formattedRevenueTrend = formatTrend(revenueTrend, monthNames);
    const formattedYachtOwnersTrend = formatTrend(yachtOwnersTrend, monthNames);
    const formattedYachtTrends = formatTrend(yachtTrends, monthNames);

    // 🚀 Format Weekday Trends
    let formattedWeekdayTrends = weekdayTrends.map((w) => ({
      day: weekdayNames[w._id - 1],
      count: w.count
    }));
    
 formattedWeekdayTrends = [...formattedWeekdayTrends.slice(1), formattedWeekdayTrends[0]];
    const responseData = {
      summary: {
        totalBookings,
        totalYachtOwners,
        totalYachts,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking._id.toString(), // ✅ Convert MongoDB `_id` to string
        user: booking.userId?.name || "Unknown",
        yacht: booking.yachtId?.title || "Unknown Yacht",
        createdAt: booking.createdAt, 
        price: booking.pricing.totals.totalRenterPayment ,
        time: Math.floor(
          (Date.now() - booking.createdAt) / (1000 * 60 * 60)
        ),
      })),
      pendingYachtApprovals,
      pendingOwnerApprovals,
      supportTracker: {
        pendingTickets,
        resolvedTickets,
      },
      trends: {
        bookingsTrend: bookingsTrend.map((b) => b.count),
        revenueTrend: revenueTrend.map((r) => r.revenue),
        yachtOwnersTrend: yachtOwnersTrend.map((y) => y.count),
        yachtTrends: yachtTrends.map((y) => y.count),
      },
      trendss: {
        bookingsTrend: {
          monthTrends: formattedBookingsTrend,
          weekdayTrends: formattedWeekdayTrends
        },
        revenueTrend: formattedRevenueTrend,
        yachtOwnersTrend: formattedYachtOwnersTrend,
        yachtTrends: formattedYachtTrends,
        visitorTrend: formattedVisitorTrend
      },
      globalVisitorTracker
    };

    // **🚀 Store Data in Cache**
    cache.set("dashboardStats", responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminDashboardStats };
