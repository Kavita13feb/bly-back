"use strict";

var buildYachtQuery = function buildYachtQuery(query) {
  var isAdmin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var searchQuery = {
    $and: []
  }; // Basic Filters

  if (query.min_price || query.max_price) {
    var priceFilter = {};
    if (query.min_price) priceFilter.$gte = parseInt(query.min_price);
    if (query.max_price) priceFilter.$lte = parseInt(query.max_price);
    searchQuery.$and.push({
      "priceDetails.daily.rate": priceFilter
    });
  }

  if (query.capacity) {
    searchQuery.$and.push({
      capacity: {
        $gte: parseInt(query.capacity)
      }
    });
  } // User-Specific Search (By Location Only)


  if (!isAdmin && query.location) {
    var regex = new RegExp(query.location, 'i');
    searchQuery.$and.push({
      "location.formattedAddress": regex
    });
  } // Admin-Specific Search (By Location, Owner Name, Yacht Title)


  if (isAdmin) {
    var searchConditions = [];

    if (query.location) {
      var _regex = new RegExp(query.location, 'i');

      searchConditions.push({
        "location.formattedAddress": _regex
      });
    }

    if (query.ownerName) {
      var _regex2 = new RegExp(query.ownerName, 'i');

      searchConditions.push({
        "ownerName": _regex2
      });
    }

    if (query.title) {
      var _regex3 = new RegExp(query.title, 'i');

      searchConditions.push({
        "title": _regex3
      });
    }

    if (searchConditions.length > 0) {
      searchQuery.$and.push({
        $or: searchConditions
      });
    } // Filter by status if provided


    if (query.status) {
      searchQuery.$and.push({
        status: query.status
      });
    }
  } else {
    // Default filter for user (only show published & approved yachts)
    searchQuery.$and.push({
      status: {
        $in: ["published", "approved"]
      }
    });
  }

  if (searchQuery.$and.length === 0) searchQuery = {};
  return searchQuery;
};

module.exports = {
  buildYachtQuery: buildYachtQuery
};