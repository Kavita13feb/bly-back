"use strict";

var axios = require('axios');

var GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Move this to environment variables in production

var fetchLocations = function fetchLocations(locationQuery) {
  var response;
  return regeneratorRuntime.async(function fetchLocations$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("locationQuery", locationQuery);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=".concat(locationQuery, "&key=").concat(GOOGLE_API_KEY)));

        case 4:
          response = _context.sent;
          return _context.abrupt("return", response.data.predictions);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching location suggestions:', _context.t0);
          res.status(500).json({
            error: 'Failed to fetch location suggestions'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Endpoint for place details


var fetchLocationDetails = function fetchLocationDetails(placeId) {
  var apiKey, url, response, result, locationDetails;
  return regeneratorRuntime.async(function fetchLocationDetails$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (placeId) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "placeId is required"
          }));

        case 2:
          _context2.prev = 2;
          apiKey = process.env.GOOGLE_API_KEY; // Store your key in .env for security

          url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=".concat(placeId, "&key=").concat(apiKey);
          _context2.next = 7;
          return regeneratorRuntime.awrap(axios.get(url));

        case 7:
          response = _context2.sent;

          if (!(response.data.status !== "OK")) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Failed to fetch location details from Google API"
          }));

        case 10:
          result = response.data.result;
          locationDetails = {
            placeId: result.place_id,
            formattedAddress: result.formatted_address,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            addressComponents: result.address_components
          };
          res.status(200).json({
            success: true,
            data: locationDetails
          });
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](2);
          console.error("Error fetching location details:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Internal Server Error"
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 15]]);
};

module.exports = {
  fetchLocations: fetchLocations,
  fetchLocationDetails: fetchLocationDetails
};