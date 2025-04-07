"use strict";

var express = require("express");

var _require = require("../controllers/InstaBookController"),
    createInstaBook = _require.createInstaBook,
    getInstaBookById = _require.getInstaBookById,
    updateInstaBook = _require.updateInstaBook,
    deleteInstaBook = _require.deleteInstaBook,
    getAllInstaBooksByOwner = _require.getAllInstaBooksByOwner;

var authenticate = require("../middlewares/authenticate");

var InstaBookRouter = express.Router();
InstaBookRouter.use(authenticate); // Create a new InstaBook

InstaBookRouter.post("/", createInstaBook); // Get all InstaBooks

InstaBookRouter.get("/", getAllInstaBooksByOwner); // Get a specific InstaBook by ID

InstaBookRouter.get("/:id", getInstaBookById); // Update a specific InstaBook by ID

InstaBookRouter.put("/:id", updateInstaBook); // Delete a specific InstaBook by ID

InstaBookRouter["delete"]("/:id", deleteInstaBook);
module.exports = InstaBookRouter;