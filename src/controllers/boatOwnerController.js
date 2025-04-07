const { default: mongoose } = require("mongoose");
const BoatModel = require("../models/boatModel");
const BoatOwnerModel = require("../models/boatOwnerModel");
const {
  saveboatOwnerDeatils,
  getboatOwnerDeatils,
  updateboatOwnerDeatils,
} = require("../repositories/boatOwnerRepository");
const UserModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");

const boatOwnerRegisterController = async (req, res, next) => {
  try {
    const ownerDetails = req.body;
    let userId = req.userId;
    let userrole = req.userrole;
    let responce = await saveboatOwnerDeatils(userId, userrole, ownerDetails);

    res.status(200).send(responce);
  } catch (error) {
    next(error);
  }
};

const getboatOwnerDetailsController = async (req, res, next) => {
  try {
    const {ownerId} = req.params;
    // console.log(ownerId)
    let responce = await getboatOwnerDeatils(ownerId);

    res.status(200).send(responce);
  } catch (error) {
    next(error);
  }
};

// const getOwnerByYachtId = async (req, res) => {
//   const { yachtId } = req.params;

//   try {
//     // Find the yacht by ID
//     const yacht = await BoatModel.findById(yachtId);
// console.log(yacht.ownerId)
//     if (!yacht) {
//       return res.status(404).json({ message: "Yacht not found" });
//     }

//     // Find the owner using the ownerId from the yacht document
//     const owner = await UserModel.findById(yacht.ownerId);
// console.log(owner)
//     if (!owner) {
//       return res.status(404).json({ message: "Owner not found" });
//     }

//     // Respond with the owner's details
//     res.status(200).json({ owner });
//   } catch (error) {
//     console.error("Error fetching owner by yacht ID:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const getOwnerByYachtId = async (req, res) => {
  const { yachtId } = req.params;

  try {
    // ✅ Find yacht and populate owner details in a single query
    const yacht = await BoatModel.findById({_id:yachtId}).populate("ownerId", "name email");

    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    if (!yacht.ownerId) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // ✅ Respond with owner details (name & email)
    res.status(200).json({ owner: yacht.ownerId });
  } catch (error) {
    console.error("❌ Error fetching owner by yacht ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getAllYachtOwners =  async (req, res) => {
//   try {
//     let {
//       search = "", // Search by name or email
//       status, // Filter by approval status
//       minYachts, // Minimum yachts owned
//       maxYachts, // Maximum yachts owned
//       location, // Filter by location (city, state, country)
//       sort = "createdAt", // Default sorting field
//       order = "desc", // Sorting order (asc/desc)
//       page = 1, // Pagination: current page
//       limit = 10, // Items per page
//     } = req.query;

//     page = parseInt(page);
//     limit = parseInt(limit);

//     // ✅ Build Filter Query
//     let filters = {};
//     console.log(req.query)
//     // Search by Name or Email
//     // if (search) {
//     //   filters["$or"] = [
//     //     { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
//     //     { email: { $regex: search, $options: "i" } }, // Case-insensitive email search
//     //   ];
//     // }
//     if (search && search.trim() !== "") {
//       // const search = req.query.search.trim();
//       filters["$or"] = [
//         { name: { $regex: search.trim(), $options: "i" } },
//         { email: { $regex: search.trim(), $options: "i" } },
//       ];
//     }
//     // Filter by Approval Status
//     if (status) filters.approvalStatus = status;

//     // Filter by Business Location
//     if (location) {
//       filters["businessLocation.city"] = { $regex: location, $options: "i" };
//     }

//     // Fetch Owners with Pagination
//     const owners = await BoatOwnerModel.find(filters)
//       .sort({ [sort]: order === "desc" ? -1 : 1 }) // ✅ Sorting
//       .skip((page - 1) * limit) // ✅ Pagination
//       .limit(limit)
//       .populate("userId", "name email contact profilePic") // ✅ Populate User Info
//       .lean();
// // console.log(owners?.userId?.name)
//     // ✅ Fetch Yacht Count for Each Owner
//     const ownerIds = owners.map((owner) => owner.userId?._id);
//     const yachtCounts = await BoatModel.aggregate([
//       { $match: { ownerId: { $in: ownerIds } } }, // ✅ Match boats by ownerId
//       { $group: { _id: "$ownerId", count: { $sum: 1 } } }, // ✅ Count yachts per owner
//     ]);

//     // Convert yacht counts into a map
//     const yachtCountMap = yachtCounts.reduce((acc, yacht) => {
//       acc[yacht._id.toString()] = yacht.count;
//       return acc;
//     }, {});

//     // ✅ Format Data for Frontend
//     const formattedOwners = owners.map((owner) => ({
//       id: owner._id.toString(), // Unique ID
//       name: owner.userId?.name || "Unknown",
//       email: owner.userId?.email || "N/A",
//       contact: owner.userId?.contact || "N/A",
//       location: `${owner?.businessLocation?.city}, ${owner?.businessLocation?.country}`,
//       yachts: yachtCountMap[owner.userId?._id.toString()] || 0, // Yacht count
//       revenue: `$${(Math.random() * 500000).toFixed(0)}K`, // Mock revenue (Replace with real logic)
//       status: owner.approvalStatus||"Pending",
//       profileImg: owner.userId?.profilePic || "https://randomuser.me/api/portraits/men/10.jpg",
//     }));

//     // ✅ Get Total Count for Pagination
//     const totalOwners = await BoatOwnerModel.countDocuments(filters);

//     res.status(200).json({
//       total: totalOwners,
//       page,
//       totalPages: Math.ceil(totalOwners / limit),
//       limit,
//       data: formattedOwners,
//     });
//   } catch (error) {
//     console.error("Error fetching yacht owners:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
const getAllYachtOwners = async (req, res) => {
  try {
    let {
      search = "",
      status,
      revenueRange,
      location,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filters = {};

    // 🔍 Search by Name or Email via UserModel
    let userIds = [];
    if (search?.trim()) {  // ✅ Safe access and trim
      const users = await UserModel.find({
        $or: [
          { name: { $regex: search.trim(), $options: "i" } },
          { email: { $regex: search.trim(), $options: "i" } },
        ],
      }).select("_id");
    
      const userIds = users.map((u) => u._id);
      filters.userId = { $in: userIds };
    }
    // ✅ Status Filter
    if (status) filters.Status = status;

    if (revenueRange && revenueRange.length === 2) {
      const [minRevenue, maxRevenue] = revenueRange.map(Number); // convert to numbers
      filters.revenue = { $gte: minRevenue, $lte: maxRevenue };
    }

    // ✅ Location filter (City, State, Country)
    if (location) {
      filters["$or"] = [
        { "businessLocation.city": { $regex: location, $options: "i" } },
        { "businessLocation.state": { $regex: location, $options: "i" } },
        { "businessLocation.country": { $regex: location, $options: "i" } },
      ];
    }
    console.log(req.query)

    // ✅ Fetch Owners
    const owners = await BoatOwnerModel.find(filters)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      // .populate("userId", "name email contact profilePic")
      .lean();

    // ✅ Count yachts per owner
    const ownerIds = owners.map((o) => o._id);

     const yachtData = await BoatModel.aggregate([
      { $match: { ownerId: { $in: ownerIds } } },
      {
        $group: {
          _id: "$ownerId",
          yachtIds: { $push: "$_id" }, // Collect Yacht IDs only
        },
      },
    ]);

    // ✅ Prepare Yacht Data Map
    const yachtDataMap = yachtData.reduce((acc, item) => {
      acc[item._id.toString()] = item.yachtIds;
      return acc;
    }, {});
    

    const revenueData = await bookingModel.aggregate([
      { $match: { ownerId: { $in: ownerIds } } },
      { $group: { _id: "$ownerId", revenue: { $sum: "$pricing.totals.totalPayout" } } }
    ]);
    
      
    console.log(revenueData)
    const revenueMap = new Map(revenueData.map((r) => [r._id.toString(), r.revenue]));
    
    console.log(filters)
    const formattedOwners = owners.map((owner) => ({
      id: owner._id.toString(),
      name: owner.name || "Unknown",
      email: owner.email || "N/A",
      contact: owner.contact || "N/A",
      location: `${owner?.businessLocation?.city || ""}, ${owner?.businessLocation?.country || ""}`,
      yachts: yachtDataMap[owner._id.toString()] || [], // Array of Yacht IDs
      revenue:`$${revenueMap.get(owner._id.toString()) || 0}`, // Mock revenue
      status: owner.Status || "Pending",
      profileImg: owner?.profilePic || "https://randomuser.me/api/portraits/men/10.jpg",
    }));

    // ✅ Pagination count
    const totalOwners = await BoatOwnerModel.countDocuments(filters);

    res.status(200).json({
      total: totalOwners,
      page,
      totalPages: Math.ceil(totalOwners / limit),
      limit,
      data: formattedOwners,
    });
  } catch (error) {
    console.error("Error fetching yacht owners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveYachtOwner = async (req, res) => {
  try {
    const owner = await BoatOwnerModel.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });

    if (!owner) {
      return res.status(404).json({ message: "Yacht owner not found" });
    }

    res.status(200).json({ success: true, message: "Yacht owner approved", owner });
  } catch (error) {
    res.status(500).json({ message: "Error approving yacht owner" });
  }
};

const updateboatOwnerDetailsController = async (req, res, next) => {
  try {
    let {ownerId} =req.params
    let userId = req.userId;
    const ownerDetails = req.body;
    console.log("req")
    let responce = await updateboatOwnerDeatils(ownerId,userId, ownerDetails);

    res.status(200).send(responce);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const createYachtOwnerByAdmin = async (req, res) => {
  try {
      const { email, password, name, businessType="Individual", businessName, contacts, businessLocation } = req.body;
console.log(req.body)
    // First create user account
    // Check if user already exists with this email
    const existingUser = await UserModel.findOne({ email });
    let userId;
console.log(existingUser)
    if (existingUser) {
      // Use existing user's ID
      userId = existingUser._id;
    } else {
      // Create new user if doesn't exist
      const userData = {
        email,
        password, 
        name,
        role: 'c' // yacht owner role
      };
      const newUser = await UserModel.create(userData);
      userId = newUser._id;
    }
   


    // Create yacht owner profile using the user ID
    const ownerData = {
      userId: userId,
      name,
      email,
      businessType,
      businessName,
      contacts,
      businessLocation,
      verified: true // Auto verify since admin is creating
    };
console.log(ownerData)
    const owner = await BoatOwnerModel.create(ownerData);

    // TODO: Send email with credentials to owner
    const updateRole = await UserModel.findByIdAndUpdate(userId, { role: 'b' }, { new: true });
    res.status(201).json({
      success: true,
      message: "Yacht owner created successfully",
      data: owner
    });

  } catch (error) {
    console.error("Error creating yacht owner:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating yacht owner",
      error: error.message 
    });
  }
};

module.exports = {
  getAllYachtOwners,
  approveYachtOwner,
  boatOwnerRegisterController,
  getboatOwnerDetailsController,
  updateboatOwnerDetailsController,
  getOwnerByYachtId,
  createYachtOwnerByAdmin
};
