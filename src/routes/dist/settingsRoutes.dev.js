"use strict";

var express = require("express");

var settingRouter = express.Router();

var settingsController = require("../controllers/settingsController"); // const { verifyAdmin } = require("../middlewares/authMiddleware"); // Protect routes
// GET settings by section


settingRouter.get("/:section", settingsController.getSettingsBySection); // UPDATE settings by section

settingRouter.put("/:section", settingsController.updateSettingsBySection);
module.exports = settingRouter;