const express = require("express");
const {
  createListController,
  editListController,
  deleteListController,
  getListController,
  getBoatDetailsController,
  getAllboatsController,
  getOwnerBoatDetailsController,
  approveYacht,
  rejectYacht,
  getYachtsByOwner,
  getAllYachtsForAdmin,
  getTopDestinations
} = require("../controllers/boatcontroller");
const checkOwnership = require("../middlewares/checkOwnership");
const { authorise } = require("../middlewares/authorise");
const authenticate = require("../middlewares/authenticate");
const boatRouter = express.Router();
const blockedAvailabilityController = require("../controllers/blockedAvailabilityController");
const multer = require("multer");
const { uploadFile } = require("../services/Strorage");


// for all genral users
boatRouter.get('/top-destinations', getTopDestinations);    

boatRouter.get("/", getAllboatsController);
boatRouter.get("/:boatId", getBoatDetailsController); 


// for owner users
boatRouter.use(authenticate);
boatRouter.post("/", authorise(["b"]), createListController);
boatRouter.post("/owner", authorise(["b"]), getListController);

// boatRouter.patch('/:boatId', authorise(["b"]), checkOwnership,editListController);
boatRouter.patch("/:boatId", editListController);

boatRouter.delete(
  "/:boatId",
  authorise(["a", "b"]),
  checkOwnership,
  deleteListController
);

boatRouter.post("/owner/block", blockedAvailabilityController.addBlock); // Add a new block
boatRouter.get("/owner/block", blockedAvailabilityController.getBlocks); // Get all blocks for a boat

// boatRouter.get("/owner/block/:yachtId", blockedAvailabilityController.getBlocksByYacht);
boatRouter.post("/owner/:ownerId", getYachtsByOwner);

boatRouter.get(
  "/owner/:boatId",
  authorise(["b"]),
  checkOwnership,
  getOwnerBoatDetailsController
);

boatRouter.put(
  "/owner/block/:blockId",
  blockedAvailabilityController.updateBlock
); // Update a block
boatRouter.delete(
  "/owner/block/:blockId",
  blockedAvailabilityController.deleteBlock
); // Delete a block
const upload = multer({ storage: multer.memoryStorage() }); // Multer setup for file handling

// Define the upload route
boatRouter.post("/upload", upload.single("file"), uploadFile);

//admin
boatRouter.put("/:yachtId/approve", approveYacht);
boatRouter.put("/:yachtId/reject", rejectYacht);  
    boatRouter.get("/admin/yachts", getAllYachtsForAdmin);
module.exports = boatRouter;
