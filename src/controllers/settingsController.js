const SettingModel = require("../models/SettingsModel");
const validateSettings = require("../utils/validateSettings");

// ✅ GET settings by section
exports.getSettingsBySection = async (req, res) => {
  const { section } = req.params;
  try {
    const data = await SettingModel.findOne({ section });

    if (!data) {
      return res.status(404).json({ message: `No settings found for section: ${section}` });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// ✅ UPDATE settings by section
exports.updateSettingsBySection = async (req, res) => {
  const { section } = req.params;
  const newSettings = req.body;
console.log(newSettings)
  try {
    if (!newSettings || typeof newSettings !== "object") {
      return res.status(400).json({ message: "Invalid settings payload" });
    }

    // const error = validateSettings(section, newSettings);
    // if (error) return res.status(400).json({ message: error });

    const updated = await SettingModel.findOneAndUpdate(
      { section },
      {
        $set: {
          settings: newSettings,
          updatedBy: req.user?._id,
          updatedAt: new Date(),
        }
      },
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json({ message: "Settings updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ message: "Failed to update settings" });
  }
};
