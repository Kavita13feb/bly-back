"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var YachtTypeModal = require('../models/yachtTypesModel'); // Get all yacht types


var getAllYachtTypes = function getAllYachtTypes(req, res) {
  var yachtTypeModals;
  return regeneratorRuntime.async(function getAllYachtTypes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(YachtTypeModal.find({}));

        case 3:
          yachtTypeModals = _context.sent;
          res.status(200).json({
            success: true,
            data: yachtTypeModals
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            success: false,
            message: 'Error fetching yacht types',
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get single yacht type by slug


var getYachtTypesBySlug = function getYachtTypesBySlug(req, res) {
  var yachtTypeModal;
  return regeneratorRuntime.async(function getYachtTypesBySlug$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(YachtTypeModal.findOne({
            slug: req.params.slug,
            status: 'active'
          }));

        case 3:
          yachtTypeModal = _context2.sent;

          if (yachtTypeModal) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: 'Yacht type not found'
          }));

        case 6:
          res.status(200).json({
            success: true,
            data: yachtTypeModal
          });
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            success: false,
            message: 'Error fetching yacht type',
            error: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Create new yacht type


var createYachtType = function createYachtType(req, res) {
  var yachtTypeModal;
  return regeneratorRuntime.async(function createYachtType$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(YachtTypeModal.create(req.body));

        case 3:
          yachtTypeModal = _context3.sent;
          res.status(201).json({
            success: true,
            data: yachtTypeModal
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(400).json({
            success: false,
            message: 'Error creating yacht type',
            error: _context3.t0.message
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Update yacht type


var updateYachtType = function updateYachtType(req, res) {
  var yachtTypeModal;
  return regeneratorRuntime.async(function updateYachtType$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(YachtTypeModal.findByIdAndUpdate(req.params.id, _objectSpread({}, req.body, {
            updatedAt: Date.now()
          }), {
            "new": true,
            runValidators: true
          }));

        case 3:
          yachtTypeModal = _context4.sent;

          if (yachtTypeModal) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: 'Yacht type not found'
          }));

        case 6:
          res.status(200).json({
            success: true,
            data: yachtTypeModal
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            success: false,
            message: 'Error updating yacht type',
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Delete yacht type (soft delete by setting status to archived)


var deleteYachtType = function deleteYachtType(req, res) {
  var yachtTypeModal;
  return regeneratorRuntime.async(function deleteYachtType$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(YachtTypeModal.findByIdAndUpdate(req.params.id, {
            status: 'archived',
            updatedAt: Date.now()
          }, {
            "new": true
          }));

        case 3:
          yachtTypeModal = _context5.sent;

          if (yachtTypeModal) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: 'Yacht type not found'
          }));

        case 6:
          res.status(200).json({
            success: true,
            message: 'Yacht type archived successfully'
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            success: false,
            message: 'Error deleting yacht type',
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getAllYachtTypes: getAllYachtTypes,
  getYachtTypesBySlug: getYachtTypesBySlug,
  createYachtType: createYachtType,
  updateYachtType: updateYachtType,
  deleteYachtType: deleteYachtType
};
[{
  "title": "Motorboat",
  "slug": "motorboat",
  "description": "Fast and agile motorboats for quick adventures and water sports.",
  "image": "https://example.com/images/motorboat.jpg",
  "popular": true,
  "status": "active",
  "displayOrder": 2,
  "features": ["Speed control", "Safety equipment", "Easy handling"],
  "priceRange": {
    "min": 100,
    "max": 1000,
    "currency": "€"
  },
  "price": "$100/day",
  "totalYachts": 200,
  "averageRating": 4.5,
  "totalBookings": 1200,
  "seoMetadata": {
    "metaTitle": "Speedy Motorboats",
    "metaDescription": "Experience thrilling rides with our range of motorboats.",
    "keywords": ["Motorboat", "Speed Boats", "Water Sports"]
  },
  "experienceLevel": "Intermediate",
  "adventureTypes": [],
  "createdAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  }
}, {
  "title": "Catamaran",
  "slug": "catamaran",
  "description": "Spacious multi-hulled boats for smooth sailing and luxurious comfort.",
  "image": "https://example.com/images/catamaran.jpg",
  "popular": true,
  "status": "active",
  "displayOrder": 3,
  "features": ["Wide deck space", "Stable sailing", "Luxury cabins"],
  "priceRange": {
    "min": 300,
    "max": 4000,
    "currency": "€"
  },
  "price": "$300/day",
  "totalYachts": 80,
  "averageRating": 4.7,
  "totalBookings": 1000,
  "seoMetadata": {
    "metaTitle": "Luxury Catamarans",
    "metaDescription": "Enjoy smooth sailing with our range of catamarans.",
    "keywords": ["Catamaran", "Multi-hull Boats", "Luxury Yachts"]
  },
  "experienceLevel": "Advanced",
  "adventureTypes": [],
  "createdAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  }
}, {
  "title": "Gulet",
  "slug": "gulet",
  "description": "Traditional Turkish wooden boats offering a charming sailing experience.",
  "image": "https://example.com/images/gulet.jpg",
  "popular": false,
  "status": "active",
  "displayOrder": 4,
  "features": ["Wooden construction", "Classic styling", "Comfortable cabins"],
  "priceRange": {
    "min": 400,
    "max": 3500,
    "currency": "€"
  },
  "price": "$400/day",
  "totalYachts": 40,
  "averageRating": 4.4,
  "totalBookings": 600,
  "seoMetadata": {
    "metaTitle": "Charming Gulets",
    "metaDescription": "Experience traditional sailing with our elegant gulets.",
    "keywords": ["Gulet", "Traditional Boats", "Wooden Boats"]
  },
  "experienceLevel": "Intermediate",
  "adventureTypes": [],
  "createdAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  }
}, {
  "title": "Power Catamaran",
  "slug": "power-catamaran",
  "description": "Powerful and stable multi-hulled boats for smooth cruising.",
  "image": "https://example.com/images/power-catamaran.jpg",
  "popular": true,
  "status": "active",
  "displayOrder": 5,
  "features": ["Dual engines", "Luxurious cabins", "Ample deck space"],
  "priceRange": {
    "min": 600,
    "max": 6000,
    "currency": "€"
  },
  "price": "$600/day",
  "totalYachts": 70,
  "averageRating": 4.9,
  "totalBookings": 900,
  "seoMetadata": {
    "metaTitle": "Powerful Catamarans",
    "metaDescription": "Explore the waters with our luxurious power catamarans.",
    "keywords": ["Power Catamaran", "Luxury Catamarans", "High-Speed Yachts"]
  },
  "experienceLevel": "Advanced",
  "adventureTypes": [],
  "createdAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2025-03-30T10:00:00.000Z"
  }
}];