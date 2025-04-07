"use strict";

var express = require("express");

var boatOwnerRouter = express.Router();

var authenticate = require("../middlewares/authenticate");

var _require = require("../controllers/boatOwnerController"),
    boatOwnerRegisterController = _require.boatOwnerRegisterController,
    getboatOwnerDetailsController = _require.getboatOwnerDetailsController,
    updateboatOwnerDetailsController = _require.updateboatOwnerDetailsController,
    getOwnerByYachtId = _require.getOwnerByYachtId,
    getAllYachtOwners = _require.getAllYachtOwners,
    approveYachtOwner = _require.approveYachtOwner,
    createYachtOwnerByAdmin = _require.createYachtOwnerByAdmin;

var _require2 = require("../middlewares/authorise"),
    authorise = _require2.authorise;

boatOwnerRouter.get("/yacht/:yachtId", getOwnerByYachtId);
boatOwnerRouter.get("/:ownerId", getboatOwnerDetailsController); // boatOwnerRouter.use(authenticate)

boatOwnerRouter.post("/register", boatOwnerRegisterController);
boatOwnerRouter.patch("/update/:ownerId", updateboatOwnerDetailsController);
boatOwnerRouter.get("/", getAllYachtOwners);
boatOwnerRouter.put("/:id/approve", authorise(["a"]), approveYachtOwner); // boatOwnerRouter.put("/:id/block", authorise(["a"]), blockYachtOwner)

boatOwnerRouter.post("/create-by-admin", createYachtOwnerByAdmin);
module.exports = boatOwnerRouter;