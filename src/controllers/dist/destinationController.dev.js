"use strict";

var BoatModel = require("../models/boatModel");

var Destination = require("../models/destinationModal"); // Get all destinations


exports.getAllDestinations = function _callee(req, res) {
  var destinations;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Destination.find());

        case 3:
          destinations = _context.sent;
          res.status(200).json({
            status: "success",
            results: destinations.length,
            data: destinations
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get single destination by ID or slug


exports.getDestination = function _callee2(req, res) {
  var destination;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Destination.findOne({
            $or: [{
              _id: req.params.id
            }, {
              slug: req.params.id
            }]
          }));

        case 3:
          destination = _context2.sent;

          if (destination) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            status: "fail",
            message: "Destination not found"
          }));

        case 6:
          res.status(200).json({
            status: "success",
            data: destination
          });
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Update destinations from yacht data


exports.updateDestinationsFromYachts = function _callee3(req, res) {
  var yachtAggregation, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, location, slug, minPriceAggregation, minPrice, unit, destination;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(BoatModel.aggregate([{
            $match: {
              "location.city": {
                $exists: true
              },
              "location.country": {
                $exists: true
              }
            }
          }, {
            $project: {
              location: {
                $concat: ["$location.city", ", ", "$location.country"]
              },
              coordinates: ["$location.geoPoint.coordinates[0]", "$location.geoPoint.coordinates[1]"],
              bookings: 1
            }
          }, {
            $group: {
              _id: "$location",
              yachtCount: {
                $sum: 1
              },
              bookingCount: {
                $sum: "$bookings.length"
              },
              coordinates: {
                $first: "$coordinates"
              }
            }
          }]));

        case 3:
          yachtAggregation = _context3.sent;
          console.log(yachtAggregation); // Update or create destinations based on yacht data

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 8;
          _iterator = yachtAggregation[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 25;
            break;
          }

          location = _step.value;
          slug = location._id.toLowerCase().replace(/\s+/g, "-"); // Get minimum price of yachts in this location

          _context3.next = 15;
          return regeneratorRuntime.awrap(BoatModel.aggregate([{
            $match: {
              "location.city": location._id.split(", ")[0],
              "location.country": location._id.split(", ")[1],
              $or: [{
                "priceDetails.hourly.rate": {
                  $exists: true,
                  $gt: 0
                }
              }, {
                "priceDetails.daily.rate": {
                  $exists: true,
                  $gt: 0
                }
              }]
            }
          }, {
            $group: {
              _id: null,
              minPrice: {
                $min: {
                  $cond: {
                    "if": {
                      $and: [{
                        $gt: ["$priceDetails.hourly.rate", 0]
                      }, {
                        $gt: ["$priceDetails.daily.rate", 0]
                      }]
                    },
                    then: {
                      $min: ["$priceDetails.hourly.rate", {
                        $divide: ["$priceDetails.daily.rate", 24]
                      }]
                    },
                    "else": {
                      $cond: {
                        "if": {
                          $gt: ["$priceDetails.hourly.rate", 0]
                        },
                        then: "$priceDetails.hourly.rate",
                        "else": {
                          $divide: ["$priceDetails.daily.rate", 24]
                        }
                      }
                    }
                  }
                }
              },
              priceUnit: {
                $first: "hour"
              }
            }
          }]));

        case 15:
          minPriceAggregation = _context3.sent;
          minPrice = minPriceAggregation.length > 0 ? minPriceAggregation[0].minPrice : 0;
          unit = minPriceAggregation.length > 0 ? minPriceAggregation[0].priceUnit : "hour";
          _context3.next = 20;
          return regeneratorRuntime.awrap(Destination.findOneAndUpdate({
            slug: slug
          }, {
            city: location._id.split(", ")[0],
            country: location._id.split(", ")[1],
            name: location._id,
            slug: slug,
            yachtCount: location.yachtCount,
            bookingCount: location.bookingCount,
            status: "active",
            price: "$".concat(minPrice, "/").concat(unit),
            pricing: {
              amount: minPrice,
              currency: "$",
              unit: unit
            },
            geoPoint: {
              type: "Point",
              coordinates: location.coordinates
            },
            $setOnInsert: {
              description: "Explore ".concat(location._id),
              shortDescription: "Discover yachting in ".concat(location._id),
              region: "",
              // To be updated by admin
              popularActivities: [],
              bestTimeToVisit: {
                months: [],
                notes: ""
              }
            }
          }, {
            upsert: true,
            "new": true,
            setDefaultsOnInsert: true
          }));

        case 20:
          destination = _context3.sent;
          console.log(destination);

        case 22:
          _iteratorNormalCompletion = true;
          _context3.next = 10;
          break;

        case 25:
          _context3.next = 31;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 31:
          _context3.prev = 31;
          _context3.prev = 32;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 34:
          _context3.prev = 34;

          if (!_didIteratorError) {
            _context3.next = 37;
            break;
          }

          throw _iteratorError;

        case 37:
          return _context3.finish(34);

        case 38:
          return _context3.finish(31);

        case 39:
          _context3.next = 41;
          return regeneratorRuntime.awrap(Destination.updateMany({
            slug: {
              $nin: yachtAggregation.map(function (l) {
                return l._id.toLowerCase().replace(/\s+/g, "-");
              })
            }
          }, {
            status: "inactive"
          }));

        case 41:
          res.status(200).json({
            status: "success",
            message: "Destinations updated successfully"
          });
          _context3.next = 48;
          break;

        case 44:
          _context3.prev = 44;
          _context3.t1 = _context3["catch"](0);
          console.log(_context3.t1);
          res.status(400).json({
            status: "fail",
            message: _context3.t1.message
          });

        case 48:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 44], [8, 27, 31, 39], [32,, 34, 38]]);
}; // Create new destination


exports.createDestination = function _callee4(req, res) {
  var newDestination;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Destination.create(req.body));

        case 3:
          newDestination = _context4.sent;
          res.status(201).json({
            status: "success",
            data: newDestination
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Update destination


exports.updateDestination = function _callee5(req, res) {
  var destination;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Destination.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 3:
          destination = _context5.sent;

          if (destination) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            status: "fail",
            message: "Destination not found"
          }));

        case 6:
          res.status(200).json({
            status: "success",
            data: destination
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Delete destination


exports.deleteDestination = function _callee6(req, res) {
  var destination;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Destination.findByIdAndDelete(req.params.id));

        case 3:
          destination = _context6.sent;

          if (destination) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            status: "fail",
            message: "Destination not found"
          }));

        case 6:
          res.status(204).json({
            status: "success",
            data: null
          });
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context6.t0.message
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Get featured destinations


exports.getFeaturedDestinations = function _callee7(req, res) {
  var destinations;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Destination.find({
            featured: true
          }));

        case 3:
          destinations = _context7.sent;
          res.status(200).json({
            status: "success",
            results: destinations.length,
            data: destinations
          });
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context7.t0.message
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Search destinations by region


exports.searchByRegion = function _callee8(req, res) {
  var region, destinations;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          region = req.params.region;
          _context8.next = 4;
          return regeneratorRuntime.awrap(Destination.find({
            region: {
              $regex: region,
              $options: "i"
            }
          }));

        case 4:
          destinations = _context8.sent;
          res.status(200).json({
            status: "success",
            results: destinations.length,
            data: destinations
          });
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context8.t0.message
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // Update destination rating


exports.updateRating = function _callee9(req, res) {
  var rating, destination, newAverageRating;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          rating = req.body.rating;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Destination.findById(req.params.id));

        case 4:
          destination = _context9.sent;

          if (destination) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            status: "fail",
            message: "Destination not found"
          }));

        case 7:
          newAverageRating = (destination.rating.averageRating * destination.rating.totalReviews + rating) / (destination.rating.totalReviews + 1);
          destination.rating.averageRating = newAverageRating;
          destination.rating.totalReviews += 1;
          _context9.next = 12;
          return regeneratorRuntime.awrap(destination.save());

        case 12:
          res.status(200).json({
            status: "success",
            data: destination
          });
          _context9.next = 18;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          res.status(400).json({
            status: "fail",
            message: _context9.t0.message
          });

        case 18:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Sample yacht data for MongoDB Atlas import


[{
  "_id": {
    "$oid": "6761780386d6c0b10b092fdf"
  },
  "location": {
    "geopoint": {
      "type": "Point",
      "coordinates": [151.5931794, -33.0133179]
    },
    "city": "Toronto",
    "state": "NSW",
    "country": "Australia",
    "address": "Toronto NSW, Australia"
  },
  "features": {
    "make": {
      "$oid": "6753bbe3cf765f124e2a8525"
    },
    "model": "Oceanus 28 VST",
    "year": 2009,
    "length": 90,
    "engines": [{
      "number_engines": "543",
      "engine_horsepower": 934,
      "engine_brand": "87tygb",
      "engine_model": "978yhu",
      "fuelType": "Diesel",
      "_id": {
        "$oid": "676178fe86d6c0b10b093010"
      }
    }],
    "amenities": [{
      "$oid": "6757c7bed4fbd650ff0601b9"
    }, {
      "$oid": "6757c7bed4fbd650ff0601ba"
    }, {
      "$oid": "6761774d3255376bb7c03235"
    }, {
      "$oid": "6761774d3255376bb7c03237"
    }, {
      "$oid": "6761774d3255376bb7c03238"
    }, {
      "$oid": "6761774d3255376bb7c03239"
    }, {
      "$oid": "6761774d3255376bb7c03233"
    }, {
      "$oid": "6761774d3255376bb7c03232"
    }, {
      "$oid": "6761774d3255376bb7c03231"
    }, {
      "$oid": "6761774d3255376bb7c03236"
    }, {
      "$oid": "6761774d3255376bb7c03234"
    }, {
      "$oid": "6761774d3255376bb7c03230"
    }, {
      "$oid": "6757c7bed4fbd650ff0601bd"
    }, {
      "$oid": "6757c7bed4fbd650ff0601bc"
    }, {
      "$oid": "676bb924c0f2f1932e3ae8dd"
    }]
  },
  "priceDetails": {
    "daily": {
      "rate": 0,
      "minDays": 0,
      "maxDays": 30
    },
    "hourly": {
      "rate": 120,
      "minDuration": 2,
      "maxDuration": 12
    },
    "person": {
      "rate": 0,
      "minPersons": 1
    },
    "currency": {
      "code": "USD",
      "symbol": "$"
    },
    "captainProvided": true,
    "captainPrice": 70
  },
  "ownerId": {
    "$oid": "6759244971ee2061ba7b4249"
  },
  "title": "House Boat 0456",
  "status": "Approved",
  "isLive": true,
  "stepCompleted": 3,
  "capacity": 25,
  "shortName": "Toronto yacht",
  "short_description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
  "description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
  "securityAllowance": 454,
  "averageRating": 0,
  "rating": 5,
  "createdAt": {
    "$date": "2024-12-17T13:09:23.778Z"
  },
  "updatedAt": {
    "$date": "2025-03-01T09:52:34.614Z"
  }
}, {
  "_id": {
    "$oid": "66cd94ad16d65b2324ac92e4"
  },
  "location": {
    "geopoint": {
      "type": "Point",
      "coordinates": [-80.1917902, 25.7616798]
    },
    "city": "Miami",
    "state": "Florida",
    "country": "USA",
    "address": "123 Marina Blvd, Miami, Florida"
  },
  "features": {
    "make": "Custom",
    "model": "Bottom Glass",
    "length": 45,
    "year": 2000,
    "engines": [{
      "number_engines": "2",
      "engine_horsepower": 300,
      "engine_brand": "Yamaha",
      "engine_model": "V8",
      "fuelType": "Diesel",
      "_id": {
        "$oid": "66f6e697e6f795bf92c80a6b"
      }
    }],
    "amenities": []
  },
  "priceDetails": {
    "daily": {
      "rate": 100,
      "minDays": 1,
      "maxDays": 5
    },
    "hourly": {
      "rate": 20,
      "minDuration": 2,
      "maxDuration": 8
    },
    "person": {
      "rate": 50,
      "minPersons": 5
    },
    "currency": {
      "code": "USD",
      "symbol": "$"
    },
    "captainProvided": true,
    "captainPrice": 100
  },
  "ownerId": {
    "$oid": "6759244971ee2061ba7b4249"
  },
  "title": "Celebrate your Yacht Party up to 34PAX, Everything Included, Great Location",
  "status": "pending",
  "isLive": false,
  "stepCompleted": 0,
  "capacity": 13,
  "shortName": "Celebrate Yacht Party",
  "short_description": "Experience the ultimate luxury on the water with a custom yacht for your party.",
  "description": "This luxury yacht offers a spacious deck, modern amenities, and a professional crew to ensure your comfort.",
  "averageRating": 4.5,
  "rating": 4.5,
  "createdAt": {
    "$date": "2024-08-27T08:56:13.967Z"
  },
  "updatedAt": {
    "$date": "2025-04-04T05:13:05.800Z"
  }
}];