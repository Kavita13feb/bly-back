"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TransactionModel = require("../models/transactionModel"); // Create a new transaction


exports.createTransaction = function _callee(req, res) {
  var transaction;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transaction = new TransactionModel(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(transaction.save());

        case 4:
          res.status(201).json(transaction);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Failed to create transaction",
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get all transactions with filters, pagination, and sorting


exports.getAllTransactions = function _callee2(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, _req$query$sortBy, sortBy, _req$query$order, order, type, status, search, query, total, transactions;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit, _req$query$sortBy = _req$query.sortBy, sortBy = _req$query$sortBy === void 0 ? "createdAt" : _req$query$sortBy, _req$query$order = _req$query.order, order = _req$query$order === void 0 ? "desc" : _req$query$order, type = _req$query.type, status = _req$query.status, search = _req$query.search;
          query = {};
          if (type) query.type = type;
          if (status) query.status = status; // Support for search

          if (search) {
            query.$or = [{
              userName: {
                $regex: search,
                $options: "i"
              }
            }, {
              userEmail: {
                $regex: search,
                $options: "i"
              }
            }, {
              ownerName: {
                $regex: search,
                $options: "i"
              }
            }, {
              yachtTitle: {
                $regex: search,
                $options: "i"
              }
            }, {
              txnId: {
                $regex: search,
                $options: "i"
              }
            }];
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(TransactionModel.countDocuments(query));

        case 8:
          total = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(TransactionModel.find(query).sort(_defineProperty({}, sortBy, order === "asc" ? 1 : -1)).skip((page - 1) * limit).limit(parseInt(limit)));

        case 11:
          transactions = _context2.sent;
          res.status(200).json({
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
            transactions: transactions
          });
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Failed to fetch transactions",
            error: _context2.t0.message
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Get single transaction by ID


exports.getTransactionById = function _callee3(req, res) {
  var transaction;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(TransactionModel.findById(req.params.id));

        case 3:
          transaction = _context3.sent;

          if (transaction) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Transaction not found"
          }));

        case 6:
          res.status(200).json(transaction);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Failed to fetch transaction",
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Update a transaction


exports.updateTransaction = function _callee4(req, res) {
  var updated;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(TransactionModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
          }, {
            "new": true
          }));

        case 3:
          updated = _context4.sent;

          if (updated) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Transaction not found"
          }));

        case 6:
          res.status(200).json(updated);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Failed to update transaction",
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Delete a transaction


exports.deleteTransaction = function _callee5(req, res) {
  var deleted;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(TransactionModel.findByIdAndDelete(req.params.id));

        case 3:
          deleted = _context5.sent;

          if (deleted) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Transaction not found"
          }));

        case 6:
          res.status(200).json({
            message: "Transaction deleted successfully"
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: "Failed to delete transaction",
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};