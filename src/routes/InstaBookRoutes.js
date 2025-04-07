const express = require("express");
const {
  createInstaBook,
  getInstaBookById,
  updateInstaBook,
  deleteInstaBook,
  getAllInstaBooksByOwner,
  getInstaBooksByYacht,
} = require("../controllers/InstaBookController");
const authenticate = require("../middlewares/authenticate");

const InstaBookRouter = express.Router();

InstaBookRouter.get("/yacht/:yachtId", getInstaBooksByYacht);

InstaBookRouter.get("/:id", getInstaBookById);

InstaBookRouter.use(authenticate)

// Create a new InstaBook
InstaBookRouter.post("/", createInstaBook);

// Get all InstaBooks
InstaBookRouter.get("/", getAllInstaBooksByOwner);


// Get a specific InstaBook by ID

// Update a specific InstaBook by ID
InstaBookRouter.put("/:id", updateInstaBook);

// Delete a specific InstaBook by ID
InstaBookRouter.delete("/:id", deleteInstaBook);

module.exports = InstaBookRouter;
