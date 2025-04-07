"use strict";

var express = require("express");

var _require = require("../controllers/boatcontroller"),
    createListController = _require.createListController,
    editListController = _require.editListController,
    deleteListController = _require.deleteListController,
    getListController = _require.getListController,
    getBoatDetailsController = _require.getBoatDetailsController,
    getAllboatsController = _require.getAllboatsController,
    getOwnerBoatDetailsController = _require.getOwnerBoatDetailsController,
    approveYacht = _require.approveYacht,
    rejectYacht = _require.rejectYacht,
    getYachtsByOwner = _require.getYachtsByOwner,
    getAllYachtsForAdmin = _require.getAllYachtsForAdmin,
    getTopDestinations = _require.getTopDestinations;

var checkOwnership = require("../middlewares/checkOwnership");

var _require2 = require("../middlewares/authorise"),
    authorise = _require2.authorise;

var authenticate = require("../middlewares/authenticate");

var boatRouter = express.Router();

var blockedAvailabilityController = require("../controllers/blockedAvailabilityController");

var multer = require("multer");

var _require3 = require("../services/Strorage"),
    uploadFile = _require3.uploadFile; // for all genral users


boatRouter.get('/top-destinations', getTopDestinations);
boatRouter.get("/", getAllboatsController);
boatRouter.get("/:boatId", getBoatDetailsController); // for owner users

boatRouter.use(authenticate);
boatRouter.post("/", authorise(["b"]), createListController);
boatRouter.post("/owner", authorise(["b"]), getListController); // boatRouter.patch('/:boatId', authorise(["b"]), checkOwnership,editListController);

boatRouter.patch("/:boatId", editListController);
boatRouter["delete"]("/:boatId", authorise(["a", "b"]), checkOwnership, deleteListController);
boatRouter.post("/owner/block", blockedAvailabilityController.addBlock); // Add a new block

boatRouter.get("/owner/block", blockedAvailabilityController.getBlocks); // Get all blocks for a boat
// boatRouter.get("/owner/block/:yachtId", blockedAvailabilityController.getBlocksByYacht);

boatRouter.post("/owner/:ownerId", getYachtsByOwner);
boatRouter.get("/owner/:boatId", authorise(["b"]), checkOwnership, getOwnerBoatDetailsController);
boatRouter.put("/owner/block/:blockId", blockedAvailabilityController.updateBlock); // Update a block

boatRouter["delete"]("/owner/block/:blockId", blockedAvailabilityController.deleteBlock); // Delete a block

var upload = multer({
  storage: multer.memoryStorage()
}); // Multer setup for file handling
// Define the upload route

boatRouter.post("/upload", upload.single("file"), uploadFile); //admin

boatRouter.put("/:yachtId/approve", approveYacht);
boatRouter.put("/:yachtId/reject", rejectYacht);
boatRouter.get("/admin/yachts", getAllYachtsForAdmin);
module.exports = boatRouter;