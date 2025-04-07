const BoatModel = require("../models/boatModel");
const CustomError = require("../utils/customError");

const checkOwnership = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { boatId } = req.params;

    const boat = await BoatModel.findById(boatId);

    if (!boat) {
      throw new CustomError("Boat not found", 404);
    }

    if (boat.ownerId.toString() !== userId.toString()) {
      throw new CustomError(
        "You are not authorized to perform this action",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkOwnership;
