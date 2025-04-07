"use strict";

var BoatModel = require("../models/boatModel");

var _require = require("../repositories/boatRepository"),
    saveBoatData = _require.saveBoatData,
    editBoatData = _require.editBoatData,
    deleteBoatData = _require.deleteBoatData,
    getAllBoats = _require.getAllBoats,
    getBoatDetails = _require.getBoatDetails,
    getOwnerBoats = _require.getOwnerBoats;

var createListController = function createListController(req, res, next) {
  var userId, boatDetails, list;
  return regeneratorRuntime.async(function createListController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.userId;
          boatDetails = req.body;
          _context.next = 5;
          return regeneratorRuntime.awrap(saveBoatData(userId, boatDetails));

        case 5:
          list = _context.sent;
          res.status(200).send(list);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          next(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getListController = function getListController(req, res) {
  var userId, filters, list;
  return regeneratorRuntime.async(function getListController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("first");
          _context2.prev = 1;
          userId = req.userId;
          filters = req.query;
          console.log("Owner ID:", userId);
          console.log("Filters:", filters); //  const filters = {
          //     location: req.query.location,
          //     priceMin: req.query.priceMin,
          //     priceMax: req.query.priceMax,
          //     boatType: req.query.boatType,
          //     capacityMin: req.query.capacityMin,
          //     capacityMax: req.query.capacityMax,
          //     date: req.query.date
          // };
          // const sortOptions = {
          //     sortBy: req.query.sortBy, // e.g., 'pricePerHour' or 'averageRating'
          //     order: req.query.order     // 'asc' or 'desc'
          // };

          _context2.next = 8;
          return regeneratorRuntime.awrap(getOwnerBoats(filters, userId));

        case 8:
          list = _context2.sent;
          // console.log(list)
          res.status(200).send(list);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

var getOwnerBoatDetailsController = function getOwnerBoatDetailsController(req, res) {
  var ownerId, boatId, list;
  return regeneratorRuntime.async(function getOwnerBoatDetailsController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          ownerId = req.userId;
          boatId = req.params.boatId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(getBoatDetails(boatId));

        case 5:
          list = _context3.sent;
          res.status(200).send(list);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var editListController = function editListController(req, res) {
  var boatId, list;
  return regeneratorRuntime.async(function editListController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // console.log(req.body)
          boatId = req.params.boatId;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(editBoatData(boatId, req.body));

        case 4:
          list = _context4.sent;
          // console.log(list)
          res.status(200).send({
            yacht: list,
            message: "BoatList updated successfully"
          });
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          console.log(_context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var deleteListController = function deleteListController(req, res) {
  var boatId, ownerId, updatedList;
  return regeneratorRuntime.async(function deleteListController$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          boatId = req.params.boatId;
          ownerId = req.userId;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(deleteBoatData(boatId, ownerId));

        case 5:
          updatedList = _context5.sent;
          res.status(200).send({
            message: "BoatList deleted successfully",
            updatedList: updatedList
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](2);
          console.log(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var getAllboatsController = function getAllboatsController(req, res, next) {
  var searchQuery, allBoats;
  return regeneratorRuntime.async(function getAllboatsController$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          searchQuery = req.query;
          _context6.next = 4;
          return regeneratorRuntime.awrap(getAllBoats(searchQuery));

        case 4:
          allBoats = _context6.sent;
          res.status(200).send(allBoats);
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getBoatDetailsController = function getBoatDetailsController(req, res) {
  var ownerId, boatId, list;
  return regeneratorRuntime.async(function getBoatDetailsController$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          ownerId = req.userId;
          boatId = req.params.boatId;
          _context7.next = 5;
          return regeneratorRuntime.awrap(getBoatDetails(boatId));

        case 5:
          list = _context7.sent;
          res.status(200).send(list);
          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var approveYacht = function approveYacht(req, res) {
  var yachtId, yacht;
  return regeneratorRuntime.async(function approveYacht$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          yachtId = req.params.yachtId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(BoatModel.findByIdAndUpdate(yachtId, {
            status: "approved"
          }, {
            "new": true
          }));

        case 4:
          yacht = _context8.sent;
          console.log(yacht);

          if (yacht) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "Yacht not found"
          }));

        case 8:
          res.status(200).json({
            message: "Yacht approved successfully",
            yacht: yacht
          });
          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          console.error("❌ Error approving yacht:", _context8.t0);
          res.status(500).json({
            message: "Failed to approve yacht"
          });

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // ✅ Reject Yacht


var rejectYacht = function rejectYacht(req, res) {
  var yachtId, yacht;
  return regeneratorRuntime.async(function rejectYacht$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          yachtId = req.params.yachtId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(BoatModel.findByIdAndUpdate(yachtId, {
            status: "rejected"
          }, {
            "new": true
          }));

        case 4:
          yacht = _context9.sent;
          console.log(yacht.status);

          if (yacht) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "Yacht not found"
          }));

        case 8:
          res.status(200).json({
            message: "Yacht rejected successfully",
            yacht: yacht
          });
          _context9.next = 15;
          break;

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          console.error("❌ Error rejecting yacht:", _context9.t0);
          res.status(500).json({
            message: "Failed to reject yacht"
          });

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getYachtsByOwner = function getYachtsByOwner(req, res) {
  var ownerId, yachts;
  return regeneratorRuntime.async(function getYachtsByOwner$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          ownerId = req.params.ownerId;
          console.log(ownerId); // ✅ Fetch yachts owned by this owner

          _context10.next = 5;
          return regeneratorRuntime.awrap(BoatModel.find({
            ownerId: ownerId
          }));

        case 5:
          yachts = _context10.sent;
          // .select('title type price location status images') // Select only necessary fields
          // .lean();
          res.status(200).json({
            success: true,
            total: yachts.length,
            yachts: yachts
          });
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.error("Failed to fetch yachts by owner:", _context10.t0);
          res.status(500).json({
            message: "Failed to fetch yachts"
          });

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //admin


var getAllYachtsForAdmin = function getAllYachtsForAdmin(req, res) {
  var query, searchQuery, yachts;
  return regeneratorRuntime.async(function getAllYachtsForAdmin$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          query = req.query;
          searchQuery = buildYachtQuery(query, true); // isAdmin = true

          _context11.next = 5;
          return regeneratorRuntime.awrap(BoatModel.find(searchQuery).populate("features.amenities").populate("ownerId", "name").limit(parseInt(query.limit) || 20).skip((parseInt(query.page) - 1) * (parseInt(query.limit) || 20)).sort({
            createdAt: -1
          }).lean());

        case 5:
          yachts = _context11.sent;
          res.status(200).json(yachts);
          _context11.next = 12;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            message: "Error fetching yachts"
          });

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getTopDestinations = function getTopDestinations(req, res) {
  var limit, topDestinations;
  return regeneratorRuntime.async(function getTopDestinations$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          limit = parseInt(req.query.limit) || 10;
          _context12.next = 4;
          return regeneratorRuntime.awrap(BoatModel.aggregate([{
            $group: {
              _id: "$location.city",
              count: {
                $sum: 1
              },
              formattedAddress: {
                $first: "$location.formattedAddress"
              },
              lat: {
                $first: "$location.lat"
              },
              lng: {
                $first: "$location.lng"
              },
              country: {
                $first: "$location.country"
              },
              state: {
                $first: "$location.state"
              }
            }
          }, {
            $sort: {
              count: -1
            }
          }, {
            $limit: limit
          }]));

        case 4:
          topDestinations = _context12.sent;
          res.status(200).json({
            success: true,
            data: topDestinations
          });
          _context12.next = 12;
          break;

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error("Error fetching top destinations:", _context12.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch top destinations"
          });

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getYachtsByOwner: getYachtsByOwner,
  createListController: createListController,
  getListController: getListController,
  getOwnerBoatDetailsController: getOwnerBoatDetailsController,
  getBoatDetailsController: getBoatDetailsController,
  editListController: editListController,
  deleteListController: deleteListController,
  getAllboatsController: getAllboatsController,
  approveYacht: approveYacht,
  rejectYacht: rejectYacht,
  getAllYachtsForAdmin: getAllYachtsForAdmin,
  getTopDestinations: getTopDestinations
};