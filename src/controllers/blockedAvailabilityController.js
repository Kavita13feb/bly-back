const BlockedAvailabilityModel = require("../models/blockedAvailbilityModel");
const BlockedAvailabilityModelModel = require("../models/blockedAvailbilityModel");
const BoatOwnerModel = require("../models/boatOwnerModel");

// Add a new block (day or slots)
const addBlock = async (req, res) => {
  try {
    const { yachtId, type, date, slots, reason } = req.body;
    const userId=req.userId
    const boatOwner = await BoatOwnerModel.findOne({ userId}); 
    if (!boatOwner) {
      return res.status(404).json({ message: "Boat Owner not found" });
    }
    const newBlock = new BlockedAvailabilityModelModel({
      yachtId,
      ownerId:boatOwner._id,
      type,
      date,
      slots: type === "slots" ? slots : undefined, // Only add slots if type is "slots"
      reason,
    });

    await newBlock.save();
    res.status(201).send(newBlock);
  } catch (error) {
    console.error("Error adding block:", error);
    res.status(500).json({ error: "Failed to add block.", details: error.message });
  }
};

// Get all blocks for a specific yacht
const getBlocksByYacht = async (req, res) => {
  try {
    const { yachtId } = req.params;

    const blocks = await BlockedAvailabilityModel.find({ yachtId });
    res.status(200).send(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ error: "Failed to fetch blocks.", details: error.message });
  }
};
const getBlocks = async (req, res) => {
  try {
    const { yachtId } = req.query;
    console.log("blockreq",req)
    const ownerId =req.userId;
console.log(yachtId)
    // ✅ Ensure at least one filter is provided
    if ( !ownerId) {
      return res.status(400).json({ error: "Either ownerId or yachtId is required" });
    }

    let filter = {};
    const userId=req.userId
    const boatOwner = await BoatOwnerModel.findOne({ userId});
    console.log("boatwoner",boatOwner) 
    filter.ownerId = boatOwner._id;
  

    if (yachtId) {
      filter.yachtId = yachtId; // ✅ Fetch blocks for a specific yacht
    }

    const blocks = await BlockedAvailabilityModel.find(filter);
console.log(blocks)
    res.status(200).json({ success: true, blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ error: "Failed to fetch blocks.", details: error.message });
  }
};


// Update an existing block
const updateBlock = async (req, res) => {
  try {
    const { id } = req.params; // Block ID
    const updates = req.body;

    const updatedBlock = await BlockedAvailabilityModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedBlock) {
      return res.status(404).json({ error: "Block not found." });
    }

    res.status(200).send(updatedBlock);
  } catch (error) {
    console.error("Error updating block:", error);
    res.status(500).json({ error: "Failed to update block.", details: error.message });
  }
};

// Delete a block
const deleteBlock = async (req, res) => {
  try {
    const { blockId } = req.params;

    const deletedBlock = await BlockedAvailabilityModel.findByIdAndDelete(blockId);

    if (!deletedBlock) {
      return res.status(404).json({ error: "Block not found." });
    }

    res.status(200).send({ message: "Block deleted successfully." });
  } catch (error) {
    console.error("Error deleting block:", error);
    res.status(500).json({ error: "Failed to delete block.", details: error.message });
  }
};

module.exports = {
  addBlock,
  getBlocksByYacht,
  updateBlock,
  deleteBlock,
  getBlocks
};
