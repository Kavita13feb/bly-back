const BoatModel = require("../models/boatModel");
const BoatOwnerModel = require("../models/boatOwnerModel");
const InstaBookModel = require("../models/InstaBookModel");

// Create a new InstaBook entry
exports.createInstaBook = async (req, res) => {
  try {
    const instaBook = new InstaBookModel(req.body);
    await instaBook.save();
    res.status(201).json(instaBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all InstaBook entries
// exports.getAllInstaBooksByOwner = async (req, res) => {
//   const ownerId = req.userId;
//   // Assuming ownerId is passed as a URL parameter
//   console.log(ownerId);
//   try {
//     // Find all yachts owned by the owner
//     const yachts = await BoatModel.find({ ownerId }).select("_id title");

//     // Extract yacht IDs
//     const yachtIds = yachts.map((yacht) => yacht._id);

//     // Find all InstaBook entries for those yachts
//     const instaBooks = await InstaBookModel.find({
//       yachtId: { $in: yachtIds },
//     }).populate({ path: "yachtId", select: "title" });
//     // console.log(instaBooks);
//     res.status(200).json(instaBooks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getAllInstaBooksByOwner = async (req, res) => {
  const userId = req.userId;
  const owner =await BoatOwnerModel.findOne({userId})
  const ownerId =owner._id
  const { yachtId } = req.query; // ✅ Get yachtId from query param if provided

  try {
    let yachts;

    if (yachtId) {
      // ✅ If yachtId is provided, fetch only that yacht
      yachts = await BoatModel.find({ ownerId, _id: yachtId }).select("_id title");
    } else {
      // ✅ Otherwise, fetch all yachts owned by the owner
      yachts = await BoatModel.find({ ownerId }).select("_id title");
    }

    // Extract yacht IDs
    const yachtIds = yachts.map((yacht) => yacht._id);

    if (yachtIds.length === 0) {
      return res.status(404).json({ message: "No yachts found for this owner" });
    }

    // Find all InstaBook entries for those yachts
    const instaBooks = await InstaBookModel.find({
      yachtId: { $in: yachtIds },
    }).populate({ path: "yachtId", select: "title" });

    res.status(200).json(instaBooks);
  } catch (err) {
    console.error("Error fetching InstaBooks:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getInstaBooksByYacht = async (req, res) => {
     const { yachtId } = req.params;
     let { startDate, endDate } = req.query;
     try {
      let filter = {  yachtId };

    // ✅ Validate and Convert Dates to ISO Format
    if (startDate) startDate = new Date(startDate).toISOString();
    if (endDate) endDate = new Date(endDate).toISOString();

    // ✅ If only startDate is provided → Get bookings from that date onward
    if (startDate && !endDate) {
      filter.date = { $gte: startDate };
    }

    // ✅ If both startDate & endDate are provided → Fetch within range
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }
       const instaBooks = await InstaBookModel.find(filter).sort({ date: 1 });
       console.log(instaBooks)
       if (!instaBooks || instaBooks.length === 0) {
         return res.status(404).json({ message: "No InstaBooks found for this yacht" });
       }
   
       res.status(200).json(instaBooks);
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: err.message });
     }
   };
// Get a single InstaBook entry by ID
exports.getInstaBookById = async (req, res) => {
  try {
    const instaBook = await InstaBookModel.findById(req.params.id).populate(
      "yachtId"
    );
    if (!instaBook) {
      return res.status(404).json({ error: "InstaBook not found" });
    }
    res.status(200).json(instaBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an InstaBook entry
exports.updateInstaBook = async (req, res) => {
  try {
    const instaBook = await InstaBookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instaBook) {
      return res.status(404).json({ error: "InstaBook not found" });
    }
    res.status(200).json(instaBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an InstaBook entry
exports.deleteInstaBook = async (req, res) => {
  try {
    const instaBook = await InstaBookModel.findByIdAndDelete(req.params.id);
    if (!instaBook) {
      return res.status(404).json({ error: "InstaBook not found" });
    }
    res.status(200).json({ message: "InstaBook deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
