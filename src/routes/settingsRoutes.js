const express = require("express");
const settingRouter = express.Router();
const settingsController = require("../controllers/settingsController");
// const { verifyAdmin } = require("../middlewares/authMiddleware"); // Protect routes

// GET settings by section
settingRouter.get("/:section",  settingsController.getSettingsBySection);

// UPDATE settings by section
settingRouter.put("/:section",  settingsController.updateSettingsBySection);

module.exports = settingRouter;
