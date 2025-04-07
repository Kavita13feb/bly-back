"use strict";

var bookingModel = require("../models/bookingModel");

var VisitorModel = require("../models/visitorsModel");

var visitorModel = require("../models/visitorsModel"); // const { generateVisitorId } = require("../utils/idGenerator");
// ✅ Add or Update Visitor


var addVisitor = function addVisitor(req, res) {
  var _req$body, ipAddress, country, existingVisitor, newVisitor;

  return regeneratorRuntime.async(function addVisitor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, ipAddress = _req$body.ipAddress, country = _req$body.country;
          _context.next = 4;
          return regeneratorRuntime.awrap(VisitorModel.findOne({
            ipAddress: ipAddress
          }));

        case 4:
          existingVisitor = _context.sent;

          if (!existingVisitor) {
            _context.next = 11;
            break;
          }

          // Update last visit and mark as returning
          existingVisitor.lastVisit = new Date();
          existingVisitor.isReturning = true;
          _context.next = 10;
          return regeneratorRuntime.awrap(existingVisitor.save());

        case 10:
          return _context.abrupt("return", res.status(200).json({
            message: "Returning visitor updated successfully",
            visitor: existingVisitor
          }));

        case 11:
          // New Visitor
          newVisitor = new VisitorModel({
            visitorId: generateVisitorId(),
            ipAddress: ipAddress,
            country: country,
            firstVisit: new Date(),
            lastVisit: new Date(),
            isReturning: false
          });
          _context.next = 14;
          return regeneratorRuntime.awrap(newVisitor.save());

        case 14:
          res.status(201).json({
            message: "New visitor added successfully",
            visitor: newVisitor
          });
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.error("Error adding visitor:", _context.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
}; // ✅ Get All Visitors (Paginated & Filtered)


var getAllVisitors = function getAllVisitors(req, res) {
  var _req$query, _req$query$search, search, _req$query$page, page, _req$query$limit, limit, query, totalVisitors, visitors;

  return regeneratorRuntime.async(function getAllVisitors$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, _req$query$search = _req$query.search, search = _req$query$search === void 0 ? "" : _req$query$search, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit;
          query = {};

          if (search.trim()) {
            query["$or"] = [{
              ipAddress: {
                $regex: search.trim(),
                $options: "i"
              }
            }, {
              country: {
                $regex: search.trim(),
                $options: "i"
              }
            }];
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(VisitorModel.countDocuments(query));

        case 6:
          totalVisitors = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(VisitorModel.find(query).sort({
            lastVisit: -1
          }) // Most recent visitors first
          .skip((page - 1) * limit).limit(parseInt(limit)).lean());

        case 9:
          visitors = _context2.sent;
          res.status(200).json({
            total: totalVisitors,
            page: parseInt(page),
            totalPages: Math.ceil(totalVisitors / limit),
            limit: parseInt(limit),
            data: visitors
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching visitors:", _context2.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getVisitorTrends = function getVisitorTrends(req, res) {
  var _req$query$weeks, weeks, now, startDate, visitors, weekSlots, i, weekStart, weekEnd, newVisitors, returningVisitors, weekLabels, response;

  return regeneratorRuntime.async(function getVisitorTrends$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$query$weeks = req.query.weeks, weeks = _req$query$weeks === void 0 ? 6 : _req$query$weeks; // Default to last 6 weeks if not provided

          weeks = parseInt(weeks);
          now = new Date();
          startDate = new Date();
          startDate.setDate(now.getDate() - weeks * 7); // Go back 'n' weeks

          console.log("Fetching visitor trends from:", startDate.toISOString()); // Fetch visitors in date range

          _context3.next = 9;
          return regeneratorRuntime.awrap(visitorModel.find({
            firstVisit: {
              $gte: startDate
            }
          }).lean());

        case 9:
          visitors = _context3.sent;
          console.log("Fetched visitors:", visitors.length); // Prepare week slots

          weekSlots = [];

          for (i = 0; i < weeks; i++) {
            weekStart = new Date();
            weekStart.setDate(now.getDate() - (weeks - i) * 7);
            weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekSlots.push({
              start: weekStart,
              end: weekEnd
            });
          }

          console.log("Week slots:", weekSlots); // Initialize result arrays

          newVisitors = Array(weeks).fill(0);
          returningVisitors = Array(weeks).fill(0); // Iterate over visitors and put them in the correct week slot

          visitors.forEach(function (visitor) {
            for (var _i = 0; _i < weekSlots.length; _i++) {
              if (visitor.firstVisit >= weekSlots[_i].start && visitor.firstVisit <= weekSlots[_i].end) {
                if (visitor.isReturning) {
                  returningVisitors[_i]++;
                } else {
                  newVisitors[_i]++;
                }

                break; // Once matched, break out of week loop
              }
            }
          }); // Prepare final labels like "Week 1", "Week 2", ..., "Week 6"

          weekLabels = Array.from({
            length: weeks
          }, function (_, i) {
            return "Week ".concat(i + 1);
          }); // Final response

          response = {
            weeks: weekLabels,
            newVisitors: newVisitors,
            returningVisitors: returningVisitors
          };
          res.status(200).json(response);
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error("Error generating visitor trends:", _context3.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // Country to Region Mapping (add more as needed)


var getVisitorBookingAnalytics = function getVisitorBookingAnalytics(req, res) {
  var region, visitorMatchStage, bookingMatchStage, visitorAggregation, bookingAggregation, dataMap;
  return regeneratorRuntime.async(function getVisitorBookingAnalytics$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          region = req.query.region;
          visitorMatchStage = region ? {
            region: region
          } : {};
          bookingMatchStage = region ? {
            "location.region": region
          } : {}; // 📊 Aggregate Visitor Data by countryCode

          _context4.next = 6;
          return regeneratorRuntime.awrap(VisitorModel.aggregate([{
            $match: visitorMatchStage
          }, {
            $group: {
              _id: "$countryCode",
              visitors: {
                $sum: 1
              },
              region: {
                $first: "$region"
              },
              name: {
                $first: "$country"
              }
            }
          }]));

        case 6:
          visitorAggregation = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(bookingModel.aggregate([{
            $match: bookingMatchStage
          }, {
            $group: {
              _id: "$location.countryCode",
              bookings: {
                $sum: 1
              },
              region: {
                $first: "$location.region"
              },
              name: {
                $first: "$location.country"
              }
            }
          }]));

        case 9:
          bookingAggregation = _context4.sent;
          // 🧠 Combine both into a single map
          dataMap = {};
          visitorAggregation.forEach(function (entry) {
            var code = entry._id;
            dataMap[code] = {
              visitors: entry.visitors,
              bookings: 0,
              region: entry.region || "Unknown",
              name: entry.name || code
            };
          });
          bookingAggregation.forEach(function (entry) {
            var code = entry._id;

            if (!dataMap[code]) {
              dataMap[code] = {
                visitors: 0,
                bookings: entry.bookings,
                region: entry.region || "Unknown",
                name: entry.name || code
              };
            } else {
              dataMap[code].bookings = entry.bookings;
            }
          });
          res.status(200).json(dataMap);
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Error in visitor-booking analytics:", _context4.t0);
          res.status(500).json({
            message: "Failed to fetch analytics data"
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var trackVisitor = function trackVisitor(req, res) {
  var _req$body2, ip, country, city, state, countryCode, stateCode, postalCode, latitude, longitude, deviceType, browser, referrer, visitorId, existingVisitor, newVisitor;

  return regeneratorRuntime.async(function trackVisitor$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body2 = req.body, ip = _req$body2.ip, country = _req$body2.country, city = _req$body2.city, state = _req$body2.state, countryCode = _req$body2.countryCode, stateCode = _req$body2.stateCode, postalCode = _req$body2.postalCode, latitude = _req$body2.latitude, longitude = _req$body2.longitude, deviceType = _req$body2.deviceType, browser = _req$body2.browser, referrer = _req$body2.referrer; // Generate a unique visitor ID if not provided (can use cookies instead)

          visitorId = req.cookies.visitorId || "VIS-".concat(crypto.randomBytes(3).toString("hex").toUpperCase()); // Check if the visitor already exists

          _context5.next = 5;
          return regeneratorRuntime.awrap(VisitorModel.findOne({
            visitorId: visitorId
          }));

        case 5:
          existingVisitor = _context5.sent;

          if (!existingVisitor) {
            _context5.next = 14;
            break;
          }

          // ✅ Returning visitor: Update lastVisit & increment visitCount
          existingVisitor.lastVisit = new Date();
          existingVisitor.visitCount += 1;
          existingVisitor.isReturning = true;
          _context5.next = 12;
          return regeneratorRuntime.awrap(existingVisitor.save());

        case 12:
          _context5.next = 18;
          break;

        case 14:
          // ✅ New visitor: Create a new entry
          newVisitor = new VisitorModel({
            visitorId: visitorId,
            ipAddress: ip,
            country: country,
            countryCode: countryCode,
            state: state,
            stateCode: stateCode,
            city: city,
            postalCode: postalCode,
            latitude: latitude,
            longitude: longitude,
            deviceType: deviceType,
            browser: browser,
            referrer: referrer,
            firstVisit: new Date(),
            lastVisit: new Date(),
            visitCount: 1,
            isReturning: false
          });
          _context5.next = 17;
          return regeneratorRuntime.awrap(newVisitor.save());

        case 17:
          // Store visitor ID in a cookie (optional)
          res.cookie("visitorId", visitorId, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true
          });

        case 18:
          res.status(200).json({
            message: "Visitor tracked successfully",
            visitorId: visitorId
          });
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          console.error("Error tracking visitor:", _context5.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

module.exports = {
  addVisitor: addVisitor,
  getAllVisitors: getAllVisitors,
  getVisitorTrends: getVisitorTrends,
  getVisitorBookingAnalytics: getVisitorBookingAnalytics
};