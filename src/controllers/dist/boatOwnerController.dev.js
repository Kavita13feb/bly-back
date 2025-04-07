"use strict";

var _require = require("mongoose"),
    mongoose = _require["default"];

var BoatModel = require("../models/boatModel");

var BoatOwnerModel = require("../models/boatOwnerModel");

var _require2 = require("../repositories/boatOwnerRepository"),
    saveboatOwnerDeatils = _require2.saveboatOwnerDeatils,
    getboatOwnerDeatils = _require2.getboatOwnerDeatils,
    updateboatOwnerDeatils = _require2.updateboatOwnerDeatils;

var UserModel = require("../models/userModel");

var boatOwnerRegisterController = function boatOwnerRegisterController(req, res, next) {
  var ownerDetails, userId, userrole, responce;
  return regeneratorRuntime.async(function boatOwnerRegisterController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          ownerDetails = req.body;
          userId = req.userId;
          userrole = req.userrole;
          _context.next = 6;
          return regeneratorRuntime.awrap(saveboatOwnerDeatils(userId, userrole, ownerDetails));

        case 6:
          responce = _context.sent;
          res.status(200).send(responce);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getboatOwnerDetailsController = function getboatOwnerDetailsController(req, res, next) {
  var ownerId, responce;
  return regeneratorRuntime.async(function getboatOwnerDetailsController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          ownerId = req.params.ownerId; // console.log(ownerId)

          _context2.next = 4;
          return regeneratorRuntime.awrap(getboatOwnerDeatils(ownerId));

        case 4:
          responce = _context2.sent;
          res.status(200).send(responce);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // const getOwnerByYachtId = async (req, res) => {
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


var getOwnerByYachtId = function getOwnerByYachtId(req, res) {
  var yachtId, yacht;
  return regeneratorRuntime.async(function getOwnerByYachtId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          yachtId = req.params.yachtId;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(BoatModel.findById({
            _id: yachtId
          }).populate("ownerId", "name email"));

        case 4:
          yacht = _context3.sent;

          if (yacht) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Yacht not found"
          }));

        case 7:
          if (yacht.ownerId) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Owner not found"
          }));

        case 9:
          // ✅ Respond with owner details (name & email)
          res.status(200).json({
            owner: yacht.ownerId
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.error("❌ Error fetching owner by yacht ID:", _context3.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; // const getAllYachtOwners =  async (req, res) => {
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
// const getAllYachtOwners = async (req, res) => {
//   try {
//     let {
//       search = "",
//       status,
//       location,
//       sort = "createdAt",
//       order = "desc",
//       page = 1,
//       limit = 10,
//     } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);
//     let filters = {};
//     // 🔍 Search by Name or Email via UserModel
//     let userIds = [];
//     if (search?.trim()) {  // ✅ Safe access and trim
//       const users = await UserModel.find({
//         $or: [
//           { name: { $regex: search.trim(), $options: "i" } },
//           { email: { $regex: search.trim(), $options: "i" } },
//         ],
//       }).select("_id");
//       const userIds = users.map((u) => u._id);
//       filters.userId = { $in: userIds };
//     }
//     // ✅ Status Filter
//     if (status) filters.Status = status;
//     // ✅ Location filter (City, State, Country)
//     if (location) {
//       filters["$or"] = [
//         { "businessLocation.city": { $regex: location, $options: "i" } },
//         { "businessLocation.state": { $regex: location, $options: "i" } },
//         { "businessLocation.country": { $regex: location, $options: "i" } },
//       ];
//     }
//     console.log(filters,req.query)
//     // ✅ Fetch Owners
//     const owners = await BoatOwnerModel.find(filters)
//       .sort({ [sort]: order === "desc" ? -1 : 1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       // .populate("userId", "name email contact profilePic")
//       .lean();
//     // ✅ Count yachts per owner
//     const ownerIds = owners.map((o) => o._id);
//     const yachtCounts = await BoatModel.aggregate([
//       { $match: { ownerId: { $in: ownerIds } } },
//       { $group: { _id: "$ownerId", count: { $sum: 1 } } },
//     ]);
//     // console.log(yachtCounts)
//     const yachtCountMap = yachtCounts.reduce((acc, y) => {
//       acc[y._id.toString()] = y.count;
//       return acc;
//     }, {});
// // console.log(yachtCountMap)
//     // ✅ Format response
//     const formattedOwners = owners.map((owner) => ({
//       id: owner._id.toString(),
//       name: owner.name || "Unknown",
//       email: owner.email || "N/A",
//       contact: owner.contact || "N/A",
//       location: `${owner?.businessLocation?.city || ""}, ${owner?.businessLocation?.country || ""}`,
//       yachts: yachtCountMap[owner._id.toString()] || 0,
//       revenue: `$${owner.revenue}K`, // Mock revenue
//       status: owner.Status || "Pending",
//       profileImg: owner?.profilePic || "https://randomuser.me/api/portraits/men/10.jpg",
//     }));
// // `$${(Math.random() * 500000).toFixed(0)}K`
//     // ✅ Pagination count
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
// };


var approveYachtOwner = function approveYachtOwner(req, res) {
  var owner;
  return regeneratorRuntime.async(function approveYachtOwner$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(BoatOwnerModel.findByIdAndUpdate(req.params.id, {
            verified: true
          }, {
            "new": true
          }));

        case 3:
          owner = _context4.sent;

          if (owner) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Yacht owner not found"
          }));

        case 6:
          res.status(200).json({
            success: true,
            message: "Yacht owner approved",
            owner: owner
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Error approving yacht owner"
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var updateboatOwnerDetailsController = function updateboatOwnerDetailsController(req, res, next) {
  var userId, ownerDetails, responce;
  return regeneratorRuntime.async(function updateboatOwnerDetailsController$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.userId;
          ownerDetails = req.body;
          _context5.next = 5;
          return regeneratorRuntime.awrap(updateboatOwnerDeatils(userId, ownerDetails));

        case 5:
          responce = _context5.sent;
          res.status(200).send(responce);
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getAllYachtOwners: getAllYachtOwners,
  approveYachtOwner: approveYachtOwner,
  boatOwnerRegisterController: boatOwnerRegisterController,
  getboatOwnerDetailsController: getboatOwnerDetailsController,
  updateboatOwnerDetailsController: updateboatOwnerDetailsController,
  getOwnerByYachtId: getOwnerByYachtId
};