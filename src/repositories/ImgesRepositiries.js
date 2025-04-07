
const ImgeModel = require("../models/ImgeModel");

const saveImages = async (userId, ImgeDetails) => {
  try {
    let ImgeDetailsWithIds = {
      ...ImgeDetails,
      userId
    };

    const Imge = await ImgeModel(ImgeDetailsWithIds);
    await Imge.save();
    return Imge;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getImages = async (boatId) => {
  try {
    let query = { boatId };

    const Images = await ImgeModel.find(query);

    return Images;
  } catch (error) {
    console.log(error);
    throw error
  }
};

const editBoatImge = async (ImgeId, ImgeDetails) => {
  try {
    const upImge = await ImgeModel.findByIdAndUpdate(
      { _id: ImgeId },
      ImgeDetails
    );

    return upImge;
  } catch (error) {
    console.log(error);
  }
};

const deleteBoatImge = async (ImgeId) => {
  try {
    const del_Imge = await ImgeModel.findByIdAndDelete(ImgeId);

    return del_Imge;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveImages,
  getImages,
  editBoatImge,
  deleteBoatImge,
};
