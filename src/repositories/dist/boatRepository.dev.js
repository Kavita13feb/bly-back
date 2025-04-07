"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BoatModel = require("../models/boatModel");

var BoatOwnerModel = require("../models/boatOwnerModel");

var saveBoatData = function saveBoatData(userId, boatDetails) {
  var boatDetailsWithId, boatList;
  return regeneratorRuntime.async(function saveBoatData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          boatDetailsWithId = _objectSpread({}, boatDetails, {
            ownerId: userId
          });
          console.log(boatDetails, boatDetailsWithId);
          _context.next = 5;
          return regeneratorRuntime.awrap(BoatModel(boatDetailsWithId));

        case 5:
          boatList = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(boatList.save());

        case 8:
          return _context.abrupt("return", boatList);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // const getOwnerBoats = async (filters, ownerId) => {
//   try {
//     let query = { ownerId };
//     if (filters.location) {
//       query.location = filters.location;
//     }
//     if (req.query.title) {
//       query.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
//     }
//     if (req.query.location) {
//       query.location = req.query.location;
//     }
//     if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
//       query.pricePerHour = { $gte: filters.priceMin, $lte: filters.priceMax };
//     }
//     if (filters.boatType) {
//       query.boatType = filters.boatType;
//     }
//     if (
//       filters.capacityMin !== undefined &&
//       filters.capacityMax !== undefined
//     ) {
//       query.capacity = { $gte: filters.capacityMin, $lte: filters.capacityMax };
//     }
//     if (filters.date) {
//       query.availability = filters.date;
//     }
//     console.log(query);
//     const boatList = await BoatModel.find(query);
//     return boatList;
//   } catch (error) {
//     console.log(error);
//   }
// };


var getOwnerBoats = function getOwnerBoats(filters, userId) {
  var owner, ownerId, query, priceMin, priceMax, capacityMin, capacityMax, boatList;
  return regeneratorRuntime.async(function getOwnerBoats$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(BoatOwnerModel.findOne({
            userId: userId
          }));

        case 3:
          owner = _context2.sent;
          ownerId = owner._id;
          query = {
            ownerId: ownerId
          };

          if (filters.title) {
            query.title = {
              $regex: filters.title,
              $options: "i"
            }; // Case-insensitive search
          }

          if (filters.location) {
            query.location = filters.location;
          }

          if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
            priceMin = Number(filters.priceMin);
            priceMax = Number(filters.priceMax);
            query.pricePerHour = {
              $gte: priceMin,
              $lte: priceMax
            };
          }

          if (filters.boatType) {
            query.boatType = filters.boatType;
          }

          if (filters.capacityMin !== undefined && filters.capacityMax !== undefined) {
            capacityMin = Number(filters.capacityMin);
            capacityMax = Number(filters.capacityMax);
            query.capacity = {
              $gte: capacityMin,
              $lte: capacityMax
            };
          }

          if (filters.date) {
            query.availability = filters.date; // Ensure availability logic is correct
          }

          console.log("Query:", query);
          _context2.next = 15;
          return regeneratorRuntime.awrap(BoatModel.find(query));

        case 15:
          boatList = _context2.sent;
          return _context2.abrupt("return", boatList);

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching boats:", _context2.t0);
          throw new Error("Failed to fetch boats");

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var getBoatDetails = function getBoatDetails(boatId) {
  var boatList;
  return regeneratorRuntime.async(function getBoatDetails$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(BoatModel.findOne({
            _id: boatId
          }));

        case 3:
          boatList = _context3.sent;
          return _context3.abrupt("return", boatList);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var editBoatData = function editBoatData(boatId, boatDetails) {
  var boatList;
  return regeneratorRuntime.async(function editBoatData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(BoatModel.findByIdAndUpdate({
            _id: boatId
          }, boatDetails));

        case 3:
          boatList = _context4.sent;
          return _context4.abrupt("return", boatList);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var deleteBoatData = function deleteBoatData(boatId, ownerId) {
  var boatList;
  return regeneratorRuntime.async(function deleteBoatData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(BoatModel.findByIdAndDelete(boatId));

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(BoatModel.find({
            ownerId: ownerId
          }));

        case 5:
          boatList = _context5.sent;
          return _context5.abrupt("return", boatList);

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting boat:", _context5.t0);
          throw new Error("Failed to delete boat");

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity ,max_price,min_price,captained} = query;
//     let searchQuery = { $and: [] };
//     if (location) {
//       searchQuery.$and.push({
//         $or: [
//           { "location.country": { $regex: location, $options: "i" } },
//           { "location.state": { $regex: location, $options: "i" } },
//           { "location.city": { $regex: location, $options: "i" } },
//           { "location.town": { $regex: location, $options: "i" } },
//         ],
//       });
//     }
//     // Add capacity filter if provided
//     if (capacity) {
//       searchQuery.$and.push({
//         capacity: { $gte: capacity }, // Minimum number of guests required
//       });
//     }
//     if (min_price !== undefined || max_price !== undefined) {
//       let priceFilter = {};
//       if (min_price !== undefined) {
//         priceFilter.$gte = min_price;
//       }
//       if (max_price !== undefined) {
//         priceFilter.$lte = max_price;
//       }
//       searchQuery.$and.push({ 'priceDetails.price': priceFilter });
//     }
//     // Add captained filter if provided
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//      'captainService.captained': captained === 'true' ? true : false,
//       });
//     }
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split('T')[0]; // Format date for consistency
//       searchQuery.$and.push({
//         blockedDates: { $ne: formattedDate } // Ensure the date is not in blockedDates
//       });
//     }
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }
//     console.log(searchQuery);
//     const boats = await BoatModel.find(searchQuery);
//     return boats
//   } catch (error) {
//     console.log(error);
//   }
// };
// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained } = query;
//     let searchQuery = { $and: [] };
//     // Normalize location query
//     if (location) {
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split by hyphen
//         .map(part => part.trim()); // Trim any extra spaces
// console.log(locationParts)
//       // Generate $or condition for location fields
//       const locationSearchConditions = locationParts.map(part => ({
//         $or: [
//           { "location.city": { $regex: part, $options: "i" } },
//           { "location.state": { $regex: part, $options: "i" } },
//           { "location.country": { $regex: part, $options: "i" } },
//           { "location.town": { $regex: part, $options: "i" } },
//         ],
//       }));
//       // Add all conditions to the $and array
//       searchQuery.$and.push(...locationSearchConditions);
//     }
//     // Add capacity filter if provided
//     if (capacity) {
//       searchQuery.$and.push({
//         capacity: { $gte: capacity },
//       });
//     }
//     // Add price filter if provided
//     if (min_price !== undefined || max_price !== undefined) {
//       let priceFilter = {};
//       if (min_price !== undefined) {
//         priceFilter.$gte = min_price;
//       }
//       if (max_price !== undefined) {
//         priceFilter.$lte = max_price;
//       }
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }
//     // Add captained filter if provided
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }
//     // Add date filter if provided
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({
//         blockedDates: { $ne: formattedDate },
//       });
//     }
//     // If no filters are applied, remove $and to match all documents
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }
//     console.log("Final Search Query:", searchQuery);
//     // Query the database
//     const boats = await BoatModel.find(searchQuery);
//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };
// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained, coordinates } = query;
//     let searchQuery = { $and: [] };
//     // Enhanced location handling
//     if (location) {
//       // Split the location string into components for partial matching
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split query by hyphens (e.g., "california-usa")
//         .map(part => part.trim()); // Trim spaces
//       // Add conditions for partial matching across location fields
//       const locationSearchConditions = {
//         $or: [
//           { "location.country": { $regex: locationParts.join(" "), $options: "i" } }, // Match combined parts
//           { "location.state": { $regex: locationParts.join(" "), $options: "i" } },
//           { "location.city": { $regex: locationParts.join(" "), $options: "i" } },
//           { "location.town": { $regex: locationParts.join(" "), $options: "i" } },
//           // Match individual parts separately for broader inclusion
//           ...locationParts.map(part => ({
//             $or: [
//               { "location.country": { $regex: part, $options: "i" } },
//               { "location.state": { $regex: part, $options: "i" } },
//               { "location.city": { $regex: part, $options: "i" } },
//               { "location.town": { $regex: part, $options: "i" } },
//             ],
//           })),
//         ],
//       };
//       searchQuery.$and.push(locationSearchConditions);
//     }
//     // Capacity filter
//     if (capacity) {
//       searchQuery.$and.push({ capacity: { $gte: capacity } });
//     }
//     // Price filter
//     if (min_price !== undefined || max_price !== undefined) {
//       const priceFilter = {};
//       if (min_price !== undefined) priceFilter.$gte = min_price;
//       if (max_price !== undefined) priceFilter.$lte = max_price;
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }
//     // Captained filter
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }
//     // Date filter
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({ blockedDates: { $ne: formattedDate } });
//     }
//     // Geo-spatial filter (Optional)
//     if (coordinates) {
//       const { latitude, longitude, maxDistance = 50000 } = coordinates; // maxDistance in meters (default: 50 km)
//       searchQuery.$and.push({
//         "location.coordinates": {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude], // User-provided coordinates
//             },
//             $maxDistance: maxDistance,
//           },
//         },
//       });
//     }
//     // If no filters are applied, reset searchQuery to match all documents
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }
//     console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2));
//     // Query the database
//     const boats = await BoatModel.find(searchQuery);
//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };
// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained, coordinates } = query;
//     let searchQuery = { $and: [] };
//     if (location) {
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split query by hyphens
//         .map(part => part.trim()); // Trim spaces
//       // Prioritize exact matches for all parts (city, state, country)
//       const exactMatchCondition = {
//         $and: [
//           { "location.city": { $regex: `^${locationParts[0]}$`, $options: "i" } },
//           { "location.state": { $regex: `^${locationParts[1] || ""}$`, $options: "i" } },
//           { "location.country": { $regex: `^${locationParts[2] || ""}$`, $options: "i" } },
//         ],
//       };
//       // Partial matches: Match individual parts with more flexibility
//       const partialMatchConditions = locationParts.map(part => ({
//         $or: [
//           { "location.city": { $regex: part, $options: "i" } },
//           { "location.state": { $regex: part, $options: "i" } },
//           { "location.country": { $regex: part, $options: "i" } },
//           { "location.town": { $regex: part, $options: "i" } },
//         ],
//       }));
//       // Combine exact and partial match conditions
//       searchQuery.$and.push({
//         $or: [
//           exactMatchCondition,
//           ...partialMatchConditions, // Broader matches come after exact matches
//         ],
//       });
//     }
//     // Add filters for capacity, price, captained status, etc.
//     if (capacity) {
//       searchQuery.$and.push({ capacity: { $gte: capacity } });
//     }
//     if (min_price !== undefined || max_price !== undefined) {
//       const priceFilter = {};
//       if (min_price !== undefined) priceFilter.$gte = min_price;
//       if (max_price !== undefined) priceFilter.$lte = max_price;
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({ blockedDates: { $ne: formattedDate } });
//     }
//     // Reset searchQuery if no conditions were added
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }
//     console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2));
//     // Query the database
//     let boats = await BoatModel.find(searchQuery);
//     // Sort results based on relevance to the query (exact matches first)
//     if (location) {
//       boats = boats.sort((a, b) => {
//         const locationParts = location.toLowerCase().split("-");
//         const scoreA = calculateRelevanceScore(a.location, locationParts);
//         const scoreB = calculateRelevanceScore(b.location, locationParts);
//         return scoreB - scoreA; // Higher score first
//       });
//     }
//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };
// // Helper function to calculate relevance score
// const calculateRelevanceScore = (location, locationParts) => {
//   let score = 0;
//   if (locationParts[0] && location.city.toLowerCase() === locationParts[0]) score += 3; // City match
//   if (locationParts[1] && location.state.toLowerCase() === locationParts[1]) score += 2; // State match
//   if (locationParts[2] && location.country.toLowerCase() === locationParts[2]) score += 1; // Country match
//   return score;
// };


var getAllBoats = function getAllBoats(query) {
  var location, _query$page, page, _query$limit, limit, date, capacity, max_price, min_price, captained, coordinates, searchQuery, skip, totalDocs, totalPages, locationParts, locationSearchConditions, priceConditions, dailyFilter, hourlyFilter, formattedDate, latitude, longitude, _coordinates$maxDista, maxDistance, boats, totalCount, formattedBoats;

  return regeneratorRuntime.async(function getAllBoats$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(query);
          _context6.prev = 1;
          location = query.location, _query$page = query.page, page = _query$page === void 0 ? 1 : _query$page, _query$limit = query.limit, limit = _query$limit === void 0 ? 10 : _query$limit, date = query.date, capacity = query.capacity, max_price = query.max_price, min_price = query.min_price, captained = query.captained, coordinates = query.coordinates;
          searchQuery = {
            $and: []
          }; // Pagination

          skip = (page - 1) * limit; // Add pagination parameters to query

          _context6.next = 7;
          return regeneratorRuntime.awrap(BoatModel.countDocuments(searchQuery));

        case 7:
          totalDocs = _context6.sent;
          totalPages = Math.ceil(totalDocs / limit); // Enhanced Location Handling

          if (location) {
            locationParts = location.toLowerCase().split("-").map(function (part) {
              return part.trim();
            });
            locationSearchConditions = {
              $or: [{
                "location.country": {
                  $regex: locationParts.join(" "),
                  $options: "i"
                }
              }, {
                "location.state": {
                  $regex: locationParts.join(" "),
                  $options: "i"
                }
              }, {
                "location.city": {
                  $regex: locationParts.join(" "),
                  $options: "i"
                }
              }, {
                "location.town": {
                  $regex: locationParts.join(" "),
                  $options: "i"
                }
              }].concat(_toConsumableArray(locationParts.map(function (part) {
                return {
                  $or: [{
                    "location.country": {
                      $regex: part,
                      $options: "i"
                    }
                  }, {
                    "location.state": {
                      $regex: part,
                      $options: "i"
                    }
                  }, {
                    "location.city": {
                      $regex: part,
                      $options: "i"
                    }
                  }, {
                    "location.town": {
                      $regex: part,
                      $options: "i"
                    }
                  }]
                };
              })))
            };
            searchQuery.$and.push(locationSearchConditions);
          } // Capacity Filter


          if (capacity) {
            searchQuery.$and.push({
              capacity: {
                $gte: capacity
              }
            });
          } // Price Filter for Daily and Hourly Rates


          if (min_price !== undefined || max_price !== undefined) {
            priceConditions = []; // Daily Price Condition

            dailyFilter = {};
            if (min_price !== undefined) dailyFilter.$gte = min_price;
            if (max_price !== undefined) dailyFilter.$lte = max_price; // Hourly Price Condition

            hourlyFilter = {};
            if (min_price !== undefined) hourlyFilter.$gte = min_price;
            if (max_price !== undefined) hourlyFilter.$lte = max_price; // Add both daily and hourly price conditions

            priceConditions.push({
              "priceDetails.daily.rate": dailyFilter
            });
            priceConditions.push({
              "priceDetails.hourly.rate": hourlyFilter
            });
            searchQuery.$and.push({
              $or: priceConditions
            });
          } // Captained Service Filter


          if (captained !== undefined) {
            searchQuery.$and.push({
              "captainService.captained": captained === "true"
            });
          } // Blocked Dates Filter


          if (date) {
            formattedDate = new Date(date).toISOString().split("T")[0];
            searchQuery.$and.push({
              "blockedDates.date": {
                $ne: formattedDate
              }
            });
          } // Geo-Spatial Filtering


          if (coordinates) {
            latitude = coordinates.latitude, longitude = coordinates.longitude, _coordinates$maxDista = coordinates.maxDistance, maxDistance = _coordinates$maxDista === void 0 ? 50000 : _coordinates$maxDista;
            searchQuery.$and.push({
              "location.coordinates": {
                $near: {
                  $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  $maxDistance: maxDistance
                }
              }
            });
          } // Reset Query if No Conditions Are Applied


          if (searchQuery.$and.length === 0) {
            searchQuery = {};
          }

          console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2)); // Add owner details to the query using populate

          _context6.next = 19;
          return regeneratorRuntime.awrap(BoatModel.find(searchQuery).populate("features.amenities").populate("ownerId", "name") // Populate owner details
          .skip(skip).limit(limit));

        case 19:
          boats = _context6.sent;
          _context6.next = 22;
          return regeneratorRuntime.awrap(BoatModel.countDocuments(searchQuery));

        case 22:
          totalCount = _context6.sent;
          // Format boats for frontend use and add index
          formattedBoats = boats.map(function (boat, index) {
            var boatObj = boat.toObject();
            return _objectSpread({}, boatObj, {
              owner: boatObj.ownerId.name,
              id: "#Y".concat(index + 1),
              // Add sequential index as id
              _id: boatObj._id // Preserve original _id

            });
          });
          return _context6.abrupt("return", {
            boats: formattedBoats,
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
          });

        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](1);
          console.error("Error fetching boats:", _context6.t0);
          throw new Error("Error fetching boats");

        case 31:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 27]]);
}; // Helper function to calculate relevance score


var calculateRelevanceScore = function calculateRelevanceScore(location, locationParts) {
  var score = 0; // Check for matches and assign scores

  if (locationParts[0] && location.city.toLowerCase() === locationParts[0]) score += 3; // Exact city match

  if (locationParts[1] && location.state.toLowerCase() === locationParts[1]) score += 2; // Exact state match

  if (locationParts[2] && location.country.toLowerCase() === locationParts[2]) score += 1; // Exact country match

  return score;
};

module.exports = {
  saveBoatData: saveBoatData,
  getOwnerBoats: getOwnerBoats,
  getAllBoats: getAllBoats,
  getBoatDetails: getBoatDetails,
  editBoatData: editBoatData,
  deleteBoatData: deleteBoatData
};