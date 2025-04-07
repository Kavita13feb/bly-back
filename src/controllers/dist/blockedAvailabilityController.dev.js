"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlockedAvailabilityModel = require("../models/blockedAvailbilityModel");

var BlockedAvailabilityModelModel = require("../models/blockedAvailbilityModel");

var BoatOwnerModel = require("../models/boatOwnerModel"); // Add a new block (day or slots)


var addBlock = function addBlock(req, res) {
  var _req$body, yachtId, type, date, slots, reason, userId, boatOwner, newBlock;

  return regeneratorRuntime.async(function addBlock$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, yachtId = _req$body.yachtId, type = _req$body.type, date = _req$body.date, slots = _req$body.slots, reason = _req$body.reason;
          userId = req.userId;
          _context.next = 5;
          return regeneratorRuntime.awrap(BoatOwnerModel.findOne({
            userId: userId
          }));

        case 5:
          boatOwner = _context.sent;

          if (boatOwner) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Boat Owner not found"
          }));

        case 8:
          newBlock = new BlockedAvailabilityModelModel({
            yachtId: yachtId,
            ownerId: boatOwner._id,
            type: type,
            date: date,
            slots: type === "slots" ? slots : undefined,
            // Only add slots if type is "slots"
            reason: reason
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(newBlock.save());

        case 11:
          res.status(201).send(newBlock);
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Error adding block:", _context.t0);
          res.status(500).json({
            error: "Failed to add block.",
            details: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Get all blocks for a specific yacht


var getBlocksByYacht = function getBlocksByYacht(req, res) {
  var yachtId, blocks;
  return regeneratorRuntime.async(function getBlocksByYacht$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          yachtId = req.params.yachtId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(BlockedAvailabilityModel.find({
            yachtId: yachtId
          }));

        case 4:
          blocks = _context2.sent;
          res.status(200).send(blocks);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching blocks:", _context2.t0);
          res.status(500).json({
            error: "Failed to fetch blocks.",
            details: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getBlocks = function getBlocks(req, res) {
  var yachtId, ownerId, filter, userId, boatOwner, blocks;
  return regeneratorRuntime.async(function getBlocks$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          yachtId = req.query.yachtId;
          console.log("blockreq", req);
          ownerId = req.userId;
          console.log(yachtId); // ✅ Ensure at least one filter is provided

          if (ownerId) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Either ownerId or yachtId is required"
          }));

        case 7:
          filter = {};
          userId = req.userId;
          _context3.next = 11;
          return regeneratorRuntime.awrap(BoatOwnerModel.findOne({
            userId: userId
          }));

        case 11:
          boatOwner = _context3.sent;
          console.log("boatwoner", boatOwner);
          filter.ownerId = boatOwner._id;

          if (yachtId) {
            filter.yachtId = yachtId; // ✅ Fetch blocks for a specific yacht
          }

          _context3.next = 17;
          return regeneratorRuntime.awrap(BlockedAvailabilityModel.find(filter));

        case 17:
          blocks = _context3.sent;
          console.log(blocks);
          res.status(200).json({
            success: true,
            blocks: blocks
          });
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error("Error fetching blocks:", _context3.t0);
          res.status(500).json({
            error: "Failed to fetch blocks.",
            details: _context3.t0.message
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // Update an existing block


var updateBlock = function updateBlock(req, res) {
  var id, updates, updatedBlock;
  return regeneratorRuntime.async(function updateBlock$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id; // Block ID

          updates = req.body;
          _context4.next = 5;
          return regeneratorRuntime.awrap(BlockedAvailabilityModel.findByIdAndUpdate(id, _objectSpread({}, updates, {
            updatedAt: new Date()
          }), {
            "new": true
          }));

        case 5:
          updatedBlock = _context4.sent;

          if (updatedBlock) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Block not found."
          }));

        case 8:
          res.status(200).send(updatedBlock);
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error("Error updating block:", _context4.t0);
          res.status(500).json({
            error: "Failed to update block.",
            details: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Delete a block


var deleteBlock = function deleteBlock(req, res) {
  var blockId, deletedBlock;
  return regeneratorRuntime.async(function deleteBlock$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          blockId = req.params.blockId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(BlockedAvailabilityModel.findByIdAndDelete(blockId));

        case 4:
          deletedBlock = _context5.sent;

          if (deletedBlock) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "Block not found."
          }));

        case 7:
          res.status(200).send({
            message: "Block deleted successfully."
          });
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting block:", _context5.t0);
          res.status(500).json({
            error: "Failed to delete block.",
            details: _context5.t0.message
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  addBlock: addBlock,
  getBlocksByYacht: getBlocksByYacht,
  updateBlock: updateBlock,
  deleteBlock: deleteBlock,
  getBlocks: getBlocks
};