const BoatModel = require("../models/boatModel");
const {
  saveBoatData,
  editBoatData,
  deleteBoatData,
  getAllBoats,
  getBoatDetails,
  getOwnerBoats,
} = require("../repositories/boatRepository");

const createListController = async (req, res,next) => {
  try {
    const userId = req.userId;
    const boatDetails = req.body;
    const list = await saveBoatData(userId, boatDetails);

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const getListController = async (req, res) => {
  console.log("first")
  try {
    const userId = req.userId;
    const filters = req.query;
    
    console.log("Owner ID:", userId);
    console.log("Filters:", filters);
    //  const filters = {
    //     location: req.query.location,
    //     priceMin: req.query.priceMin,
    //     priceMax: req.query.priceMax,
    //     boatType: req.query.boatType,
    //     capacityMin: req.query.capacityMin,
    //     capacityMax: req.query.capacityMax,
    //     date: req.query.date
    // };

    // const sortOptions = {
    //     sortBy: req.query.sortBy, // e.g., 'pricePerHour' or 'averageRating'
    //     order: req.query.order     // 'asc' or 'desc'
    // };
    const list = await getOwnerBoats(filters, userId);
// console.log(list)
    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
};

const getOwnerBoatDetailsController = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { boatId } = req.params;
    const list = await getBoatDetails(boatId);

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
};
const editListController = async (req, res) => {
  // console.log(req.body)
  const { boatId } = req.params;
  try {
    const list = await editBoatData(boatId, req.body);
    // console.log(list)
    res.status(200).send({yacht:list, message: "BoatList updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

const deleteListController = async (req, res) => {
  const { boatId } = req.params;
  const ownerId = req.userId;

  try {
    const updatedList = await deleteBoatData(boatId,ownerId);

    res.status(200).send({ message: "BoatList deleted successfully", updatedList });
  } catch (error) {
    console.log(error);
  }
};

const getAllboatsController = async (req, res, next) => {
  try {
    const searchQuery = req.query;
    const allBoats = await getAllBoats(searchQuery);
    
    res.status(200).send(allBoats);
  } catch (error) {
    console.log(error);
  }
};

const getBoatDetailsController = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { boatId } = req.params;
    const list = await getBoatDetails(boatId);

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
};


const approveYacht = async (req, res) => {
  try {
    
    const { yachtId } = req.params;
    const yacht = await BoatModel.findByIdAndUpdate(yachtId, { status: "approved" }, { new: true });
console.log(yacht)
    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    res.status(200).json({ message: "Yacht approved successfully", yacht });
  } catch (error) {
    console.error("❌ Error approving yacht:", error);
    res.status(500).json({ message: "Failed to approve yacht" });
  }
};

// ✅ Reject Yacht
const rejectYacht = async (req, res) => {
  try {
    const { yachtId } = req.params;
    const yacht = await BoatModel.findByIdAndUpdate(yachtId, { status: "rejected" }, { new: true });
console.log(yacht.status)
    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    res.status(200).json({ message: "Yacht rejected successfully", yacht });
  } catch (error) {
    console.error("❌ Error rejecting yacht:", error);
    res.status(500).json({ message: "Failed to reject yacht" });
  }
};

const getYachtsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
console.log(ownerId)
    // ✅ Fetch yachts owned by this owner
    const yachts = await BoatModel.find({ ownerId })
      // .select('title type price location status images') // Select only necessary fields
      // .lean();

    res.status(200).json({
      success: true,
      total: yachts.length,
      yachts,
    });
  } catch (error) {
    console.error("Failed to fetch yachts by owner:", error);
    res.status(500).json({ message: "Failed to fetch yachts" });
  }
};
//admin
const getAllYachtsForAdmin = async (req, res) => {
  try {
    const query = req.query;
    const searchQuery = buildYachtQuery(query, true); // isAdmin = true

    const yachts = await BoatModel.find(searchQuery)
      .populate("features.amenities")
      .populate("ownerId", "name")
      .limit(parseInt(query.limit) || 20)
      .skip((parseInt(query.page) - 1) * (parseInt(query.limit) || 20))
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(yachts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching yachts" });
  }
};


const getTopDestinations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topDestinations = await BoatModel.aggregate([
      { 
        $group: { 
          
          _id: "$location.city", 
          count: { $sum: 1 },
          formattedAddress: { $first: "$location.formattedAddress" },
          lat: { $first: "$location.lat" },
          lng: { $first: "$location.lng" },
          country: { $first: "$location.country" },
          state: { $first: "$location.state" }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    res.status(200).json({
      success: true,
      data: topDestinations
    });
  } catch (error) {
    console.error("Error fetching top destinations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top destinations"
    });
  }
};

module.exports = {
  getYachtsByOwner,
  createListController,
  getListController,
  getOwnerBoatDetailsController,
  getBoatDetailsController,
  editListController,
  deleteListController,
  getAllboatsController,
  approveYacht,
  rejectYacht,
  getAllYachtsForAdmin,
  getTopDestinations
};
