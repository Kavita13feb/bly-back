const express = require("express");
const boatOwnerRouter = express.Router();
const authenticate = require("../middlewares/authenticate");

const {
  boatOwnerRegisterController,
  getboatOwnerDetailsController,
  updateboatOwnerDetailsController,
  getOwnerByYachtId,
  getAllYachtOwners,
  approveYachtOwner,
  createYachtOwnerByAdmin,     
} = require("../controllers/boatOwnerController");
const { authorise } = require("../middlewares/authorise");
boatOwnerRouter.get("/yacht/:yachtId", getOwnerByYachtId);

boatOwnerRouter.get("/:ownerId", getboatOwnerDetailsController);
// boatOwnerRouter.use(authenticate)
boatOwnerRouter.post("/register", boatOwnerRegisterController);
boatOwnerRouter.patch("/update/:ownerId", updateboatOwnerDetailsController);

boatOwnerRouter.get("/", getAllYachtOwners);
boatOwnerRouter.put("/:id/approve", authorise(["a"]), approveYachtOwner);
// boatOwnerRouter.put("/:id/block", authorise(["a"]), blockYachtOwner)
     boatOwnerRouter.post("/create-by-admin", createYachtOwnerByAdmin);


module.exports = boatOwnerRouter;
