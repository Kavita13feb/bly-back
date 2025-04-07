"use strict";

var express = require("express");

var transactionController = require("../controllers/transactionController");

var transactionRouter = express.Router(); // CRUD Routes

transactionRouter.post("/", transactionController.createTransaction);
transactionRouter.get("/", transactionController.getAllTransactions);
transactionRouter.get("/:id", transactionController.getTransactionById);
transactionRouter.patch("/:id", transactionController.updateTransaction);
transactionRouter["delete"]("/:id", transactionController.deleteTransaction);
module.exports = transactionRouter;