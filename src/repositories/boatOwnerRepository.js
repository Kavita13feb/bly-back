const BoatOwnerModel = require("../models/boatOwnerModel");
const UserModel = require("../models/userModel");
const CustomError = require("../utils/customError");

const saveboatOwnerDeatils = async (userId, userrole, boatOwner) => {
  try {
    if (userrole == "b") {
      throw new CustomError(
        "Registration failed: User is already registered as a boat owner",
        400
      );
    }
    console.log(userId)
    const storedboatOwner = await BoatOwnerModel({...boatOwner,userId});

    await storedboatOwner.save();
    await UserModel.findByIdAndUpdate(userId, {
      role: "b",
    });
    user =await UserModel.findOne(userId)
    return {status:"success",message:"Registration successful as yacht owner",user}
  } catch (error) {
    console.log(error);
    //  throw new CustomError('Login failed: Invalid credentials.', 401);
    throw error;
    // throw new CustomError(error.message || 'An error occurred while saving boat owner details', error.status || 500);
  }
};

const getboatOwnerDeatils = async (ownerId) => {
  try {
    const boatOwner = await UserModel.findOne({ _id:ownerId });
    // const nameEmail =await UserModel.findOne({userId:ownerId})
    // console.log(boatOwner)
    return boatOwner;
  } catch (error) {
    throw error;
  }
};

const updateboatOwnerDeatils = async (ownerId, userId, updatedData) => {
  const updateObj = {};

  // Update basic fields if present
  if (updatedData.name) updateObj.name = updatedData.name;
  if (updatedData.email) updateObj.email = updatedData.email;
  if (updatedData.contact) updateObj.contact = updatedData.contact;
  if (updatedData.status) updateObj.Status = updatedData.status;
  if (updatedData.profileImg) updateObj.profilePic = updatedData.profileImg;

  // Revenue parsing (if present)
  if (updatedData.revenue) {
    const revenueValue = parseInt(
      updatedData.revenue.toString().replace(/[$,K]/g, "")
    ) * 1000;
    updateObj.revenue = isNaN(revenueValue) ? 0 : revenueValue;
  }

  // Handle business location (if present)
  if (updatedData.location || updatedData.businessLocation) {
    updateObj.businessLocation = {};
    const locationParts = updatedData.location
      ? updatedData.location.split(",").map((p) => p.trim())
      : [];

    // City and Country from 'location' string
    if (locationParts[0]) updateObj.businessLocation.city = locationParts[0];
    if (locationParts[1]) updateObj.businessLocation.country = locationParts[1];

    // State and Town from businessLocation object if available
    if (updatedData.businessLocation?.state)
      updateObj.businessLocation.state = updatedData.businessLocation.state;

    if (updatedData.businessLocation?.town)
      updateObj.businessLocation.town = updatedData.businessLocation.town;
  }

  console.log(ownerId, updateObj); // Debug purpose

  try {
    const boatOwner = await BoatOwnerModel.findByIdAndUpdate(
      ownerId,
      { $set: updateObj }, // ✅ Use $set to update only specified fields
      { new: true } // ✅ Return updated document
    );
    console.log(boatOwner); // Debug purpose
    return boatOwner;
  } catch (error) {
    console.error("Error updating yacht owner:", error);
    throw error;
  }
};


module.exports = {
  saveboatOwnerDeatils,
  getboatOwnerDeatils,
  updateboatOwnerDeatils,
};
