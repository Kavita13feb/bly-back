const BoatModel = require("../models/boatModel");
const BoatOwnerModel = require("../models/boatOwnerModel");
const BookingModel = require("../models/bookingModel");
const { fetchLocationDetails } = require("../services/locationService");
const saveBoatData = async (userId, boatDetails) => {
  try {
    const owner = await BoatOwnerModel.findOne({userId})
    
    let boatDetailsWithId = { ...boatDetails, ownerId: owner._id,ownerName:owner.name };
    console.log(boatDetails, boatDetailsWithId);

    const boatList = await BoatModel(boatDetailsWithId);
    await boatList.save();
    return boatList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const getOwnerBoats = async (filters, ownerId) => {
//   try {
//     let query = { ownerId };
//     if (filters.location) {
//       query.location = filters.location;
//     }
//     if (req.query.title) {
//       query.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
//     }
//     if (req.query.location) {
//       query.location = req.query.location;
//     }
//     if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
//       query.pricePerHour = { $gte: filters.priceMin, $lte: filters.priceMax };
//     }
//     if (filters.boatType) {
//       query.boatType = filters.boatType;
//     }
//     if (
//       filters.capacityMin !== undefined &&
//       filters.capacityMax !== undefined
//     ) {
//       query.capacity = { $gte: filters.capacityMin, $lte: filters.capacityMax };
//     }
//     if (filters.date) {
//       query.availability = filters.date;
//     }
//     console.log(query);
//     const boatList = await BoatModel.find(query);

//     return boatList;
//   } catch (error) {
//     console.log(error);
//   }
// };
const getOwnerBoats = async (filters, userId) => {
  try {
    let owner =await BoatOwnerModel.findOne({userId})
    let ownerId=owner._id;
    let query = { ownerId };

    if (filters.title) {
      query.title = { $regex: filters.title, $options: "i" }; // Case-insensitive search
    }
    if (filters.location) {
      query.location = filters.location;
    }
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      const priceMin = Number(filters.priceMin);
      const priceMax = Number(filters.priceMax);
      query.pricePerHour = { $gte: priceMin, $lte: priceMax };
    }
    if (filters.boatType) {
      query.boatType = filters.boatType;
    }
    if (filters.capacityMin !== undefined && filters.capacityMax !== undefined) {
      const capacityMin = Number(filters.capacityMin);
      const capacityMax = Number(filters.capacityMax);
      query.capacity = { $gte: capacityMin, $lte: capacityMax };
    }
    if (filters.date) {
      query.availability = filters.date; // Ensure availability logic is correct
    }

    console.log("Query:", query);

    const boatList = await BoatModel.find(query);
    // console.log(boatList)
    return boatList;
  } catch (error) {
    console.error("Error fetching boats:", error);
    throw new Error("Failed to fetch boats");
  }
};

const getBoatDetails = async (boatId) => {
  try {
    const boatList = await BoatModel.findOne({ _id: boatId });

    return boatList;
  } catch (error) {
    console.log(error);
  }
};

const editBoatData = async (boatId, boatDetails) => {
  try {
    // console.log(boatDetails)
    // Check if a placeId is provided
    // Convert status to lowercase if it's being updated
    if (boatDetails.status) {
      boatDetails.status = boatDetails.status.toLowerCase();
    }
    // if (boatDetails.placeId) {
    //   const locationDetails = await fetchLocationDetails(boatDetails.placeId);
    //   boatDetails.location = locationDetails; // Update location field with fetched details
    //   delete boatDetails.placeId; // Remove placeId as it's now stored within location
    // }
console.log(boatDetails)

    const updatedBoat = await BoatModel.findByIdAndUpdate(
      boatId,
      { $set: boatDetails },
      { new: true, runValidators: true } // Ensures updated document is returned
    );
// console.log("updatedBoat",updatedBoat)
    return updatedBoat;
  } catch (error) {
    console.log("Error updating boat data:", error);
    throw new Error("Error updating boat data");
  }
};

const deleteBoatData = async (boatId,ownerId) => {
  try {
    // Delete the yacht
    await BoatModel.findByIdAndDelete(boatId);
// console.log(ownerId)
    // Fetch the updated list of yachts
    const boatList = await BoatModel.find({ownerId});
// console.log(boatList)
    return boatList; // Return the updated list
  } catch (error) {
    console.error("Error deleting boat:", error);
    throw new Error("Failed to delete boat");
  }
};


// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity ,max_price,min_price,captained} = query;
//     let searchQuery = { $and: [] };
 
//     if (location) {
//       searchQuery.$and.push({
//         $or: [
//           { "location.country": { $regex: location, $options: "i" } },
//           { "location.state": { $regex: location, $options: "i" } },
//           { "location.city": { $regex: location, $options: "i" } },
//           { "location.town": { $regex: location, $options: "i" } },
//         ],
//       });
//     }

//     // Add capacity filter if provided
//     if (capacity) {
//       searchQuery.$and.push({
//         capacity: { $gte: capacity }, // Minimum number of guests required
//       });
//     }
//     if (min_price !== undefined || max_price !== undefined) {
//       let priceFilter = {};
//       if (min_price !== undefined) {
//         priceFilter.$gte = min_price;
//       }
//       if (max_price !== undefined) {
//         priceFilter.$lte = max_price;
//       }
//       searchQuery.$and.push({ 'priceDetails.price': priceFilter });
//     }

//     // Add captained filter if provided
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//      'captainService.captained': captained === 'true' ? true : false,
//       });
//     }

//     if (date) {
//       const formattedDate = new Date(date).toISOString().split('T')[0]; // Format date for consistency

//       searchQuery.$and.push({
//         blockedDates: { $ne: formattedDate } // Ensure the date is not in blockedDates
//       });
//     }
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }
//     console.log(searchQuery);

//     const boats = await BoatModel.find(searchQuery);

//     return boats
//   } catch (error) {
//     console.log(error);
//   }
// };
// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained } = query;
//     let searchQuery = { $and: [] };

//     // Normalize location query
//     if (location) {
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split by hyphen
//         .map(part => part.trim()); // Trim any extra spaces
// console.log(locationParts)
//       // Generate $or condition for location fields
//       const locationSearchConditions = locationParts.map(part => ({
//         $or: [
//           { "location.city": { $regex: part, $options: "i" } },
//           { "location.state": { $regex: part, $options: "i" } },
//           { "location.country": { $regex: part, $options: "i" } },
//           { "location.town": { $regex: part, $options: "i" } },
//         ],
//       }));

//       // Add all conditions to the $and array
//       searchQuery.$and.push(...locationSearchConditions);
//     }

//     // Add capacity filter if provided
//     if (capacity) {
//       searchQuery.$and.push({
//         capacity: { $gte: capacity },
//       });
//     }

//     // Add price filter if provided
//     if (min_price !== undefined || max_price !== undefined) {
//       let priceFilter = {};
//       if (min_price !== undefined) {
//         priceFilter.$gte = min_price;
//       }
//       if (max_price !== undefined) {
//         priceFilter.$lte = max_price;
//       }
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }

//     // Add captained filter if provided
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }

//     // Add date filter if provided
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({
//         blockedDates: { $ne: formattedDate },
//       });
//     }

//     // If no filters are applied, remove $and to match all documents
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }

//     console.log("Final Search Query:", searchQuery);

//     // Query the database
//     const boats = await BoatModel.find(searchQuery);

//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };
// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained, coordinates } = query;
//     let searchQuery = { $and: [] };

//     // Enhanced location handling
//     if (location) {
//       // Split the location string into components for partial matching
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split query by hyphens (e.g., "california-usa")
//         .map(part => part.trim()); // Trim spaces

//       // Add conditions for partial matching across location fields
//       const locationSearchConditions = {
//         $or: [
//           { "location.country": { $regex: locationParts.join(" "), $options: "i" } }, // Match combined parts
//           { "location.state": { $regex: locationParts.join(" "), $options: "i" } },
//           { "location.city": { $regex: locationParts.join(" "), $options: "i" } },
//           { "location.town": { $regex: locationParts.join(" "), $options: "i" } },
//           // Match individual parts separately for broader inclusion
//           ...locationParts.map(part => ({
//             $or: [
//               { "location.country": { $regex: part, $options: "i" } },
//               { "location.state": { $regex: part, $options: "i" } },
//               { "location.city": { $regex: part, $options: "i" } },
//               { "location.town": { $regex: part, $options: "i" } },
//             ],
//           })),
//         ],
//       };

//       searchQuery.$and.push(locationSearchConditions);
//     }

//     // Capacity filter
//     if (capacity) {
//       searchQuery.$and.push({ capacity: { $gte: capacity } });
//     }

//     // Price filter
//     if (min_price !== undefined || max_price !== undefined) {
//       const priceFilter = {};
//       if (min_price !== undefined) priceFilter.$gte = min_price;
//       if (max_price !== undefined) priceFilter.$lte = max_price;
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }

//     // Captained filter
//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }

//     // Date filter
//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({ blockedDates: { $ne: formattedDate } });
//     }

//     // Geo-spatial filter (Optional)
//     if (coordinates) {
//       const { latitude, longitude, maxDistance = 50000 } = coordinates; // maxDistance in meters (default: 50 km)
//       searchQuery.$and.push({
//         "location.coordinates": {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude], // User-provided coordinates
//             },
//             $maxDistance: maxDistance,
//           },
//         },
//       });
//     }

//     // If no filters are applied, reset searchQuery to match all documents
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }

//     console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2));

//     // Query the database
//     const boats = await BoatModel.find(searchQuery);

//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };

// const getAllBoats = async (query) => {
//   console.log(query);
//   try {
//     const { location, date, capacity, max_price, min_price, captained, coordinates } = query;
//     let searchQuery = { $and: [] };

//     if (location) {
//       const locationParts = location
//         .toLowerCase()
//         .split("-") // Split query by hyphens
//         .map(part => part.trim()); // Trim spaces

//       // Prioritize exact matches for all parts (city, state, country)
//       const exactMatchCondition = {
//         $and: [
//           { "location.city": { $regex: `^${locationParts[0]}$`, $options: "i" } },
//           { "location.state": { $regex: `^${locationParts[1] || ""}$`, $options: "i" } },
//           { "location.country": { $regex: `^${locationParts[2] || ""}$`, $options: "i" } },
//         ],
//       };

//       // Partial matches: Match individual parts with more flexibility
//       const partialMatchConditions = locationParts.map(part => ({
//         $or: [
//           { "location.city": { $regex: part, $options: "i" } },
//           { "location.state": { $regex: part, $options: "i" } },
//           { "location.country": { $regex: part, $options: "i" } },
//           { "location.town": { $regex: part, $options: "i" } },
//         ],
//       }));

//       // Combine exact and partial match conditions
//       searchQuery.$and.push({
//         $or: [
//           exactMatchCondition,
//           ...partialMatchConditions, // Broader matches come after exact matches
//         ],
//       });
//     }

//     // Add filters for capacity, price, captained status, etc.
//     if (capacity) {
//       searchQuery.$and.push({ capacity: { $gte: capacity } });
//     }

//     if (min_price !== undefined || max_price !== undefined) {
//       const priceFilter = {};
//       if (min_price !== undefined) priceFilter.$gte = min_price;
//       if (max_price !== undefined) priceFilter.$lte = max_price;
//       searchQuery.$and.push({ "priceDetails.price": priceFilter });
//     }

//     if (captained !== undefined) {
//       searchQuery.$and.push({
//         "captainService.captained": captained === "true",
//       });
//     }

//     if (date) {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       searchQuery.$and.push({ blockedDates: { $ne: formattedDate } });
//     }

//     // Reset searchQuery if no conditions were added
//     if (searchQuery.$and.length === 0) {
//       searchQuery = {};
//     }

//     console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2));

//     // Query the database
//     let boats = await BoatModel.find(searchQuery);

//     // Sort results based on relevance to the query (exact matches first)
//     if (location) {
//       boats = boats.sort((a, b) => {
//         const locationParts = location.toLowerCase().split("-");

//         const scoreA = calculateRelevanceScore(a.location, locationParts);
//         const scoreB = calculateRelevanceScore(b.location, locationParts);

//         return scoreB - scoreA; // Higher score first
//       });
//     }

//     return boats;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching boats");
//   }
// };

// // Helper function to calculate relevance score
// const calculateRelevanceScore = (location, locationParts) => {
//   let score = 0;

//   if (locationParts[0] && location.city.toLowerCase() === locationParts[0]) score += 3; // City match
//   if (locationParts[1] && location.state.toLowerCase() === locationParts[1]) score += 2; // State match
//   if (locationParts[2] && location.country.toLowerCase() === locationParts[2]) score += 1; // Country match

//   return score;
// };

const getAllBoats = async (query) => {
  console.log(query);
  try {
    const {
      location,
      search,
      page=1,
      limit=10,
      date,
      capacity,
      max_price,
      min_price,
      captained,
      coordinates,
    } = query;

    let searchQuery = { $and: [] };
    // Pagination
  
    const skip = (page - 1) * limit;
    
    // Add status filter if provided
    if (query.status && Array.isArray(query.status) && query.status.length > 0) {
      searchQuery.$and.push({ status: { $in: query.status } });
    }
    // Add pagination parameters to query
    const totalDocs = await BoatModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalDocs / limit);
    // Enhanced Location Handling
    if (search) {
      const regex = new RegExp(search, "i");
      searchQuery.$and.push({
        $or: [
          { title: regex },
          { "ownerName": regex }
        ]
      });
    }
    if (location) {
      const locationParts = location
        .toLowerCase()
        .split("-")
        .map((part) => part.trim());

      const locationSearchConditions = {
        $or: [
          
          { "location.country": { $regex: locationParts.join(" "), $options: "i" } },
          { "location.state": { $regex: locationParts.join(" "), $options: "i" } },
          { "location.city": { $regex: locationParts.join(" "), $options: "i" } },
          { "location.town": { $regex: locationParts.join(" "), $options: "i" } },
          ...locationParts.map((part) => ({
            $or: [
              { "location.country": { $regex: part, $options: "i" } },
              { "location.state": { $regex: part, $options: "i" } },
              { "location.city": { $regex: part, $options: "i" } },
              { "location.town": { $regex: part, $options: "i" } },
            ],
          })),
        ],
      };

      searchQuery.$and.push(locationSearchConditions);
    }

    // Capacity Filter
    if (capacity) {
      searchQuery.$and.push({ capacity: { $gte: capacity } });
    }

    // Price Filter for Daily and Hourly Rates
    if (min_price !== undefined || max_price !== undefined) {
      const priceConditions = [];

      // Daily Price Condition
      const dailyFilter = {};
      if (min_price !== undefined) dailyFilter.$gte = min_price;
      if (max_price !== undefined) dailyFilter.$lte = max_price;

      // Hourly Price Condition
      const hourlyFilter = {};
      if (min_price !== undefined) hourlyFilter.$gte = min_price;
      if (max_price !== undefined) hourlyFilter.$lte = max_price;

      // Add both daily and hourly price conditions
      priceConditions.push({ "priceDetails.daily.rate": dailyFilter });
      priceConditions.push({ "priceDetails.hourly.rate": hourlyFilter });

      searchQuery.$and.push({
        $or: priceConditions,
      });
    }

    // Captained Service Filter
    if (captained !== undefined) {
      searchQuery.$and.push({
        "captainService.captained": captained === "true",
      });
    }

    // Blocked Dates Filter
    if (date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      searchQuery.$and.push({
        "blockedDates.date": { $ne: formattedDate },
      });
    }

    // Geo-Spatial Filtering
    if (coordinates) {
      const { latitude, longitude, maxDistance = 50000 } = coordinates;
      searchQuery.$and.push({
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });
    }

    // Reset Query if No Conditions Are Applied
    if (searchQuery.$and.length === 0) {
      searchQuery = {};
    }
    // Owner Name Search
  
    console.log("Final Search Query:", JSON.stringify(searchQuery, null, 2));
    // Add owner details to the query using populate
   // Filter out boats with 'draft' status
   searchQuery.$and = searchQuery.$and || [];
   searchQuery.$and.push({ status: { $ne: "draft" } });
   const boats = await BoatModel.find(searchQuery)
      .populate("features.amenities")
      .populate("ownerId", "name") // Populate owner details
      .skip(skip)
      .limit(limit);


    // Query the database
    // const boats = await BoatModel.find(searchQuery).populate("features.amenities").skip(skip).limit(limit);

    // Get total count for pagination
    const totalCount = await BoatModel.countDocuments(searchQuery);

    const boatsWithBookingStatus = await Promise.all(
      boats.map(async (boat, index) => {
        const bookingStatus = await getBookingStatus(boat);

        // If bookingStatus filtering is applied, skip boats that don't match
        if (bookingStatus !== bookingStatus && bookingStatus) return null;

        const boatObj = boat.toObject();
        return {
          ...boatObj,
          owner: boatObj.ownerId.name,
          listingStatus: boatObj.status,
          name: boatObj.title,
          id: `#Y${index + 1}`,
          _id: boatObj._id,
          price: `$${boatObj?.priceDetails?.hourly?.rate || boatObj?.priceDetails?.daily?.rate}`,
          status: bookingStatus // Adding Booking Status to the response
        };
      })
    );

    const filteredBoats = boatsWithBookingStatus.filter(boat => boat !== null);
    // // Format boats for frontend use and add index
    //     const formattedBoats = boats.map((boat, index) => {
    //   const boatObj = boat.toObject();
    //   return {
    //     ...boatObj,
    //     owner: boatObj.ownerId.name,
    //     listingStatus: boatObj.status,
    //     name: boatObj.title,
    //     id: `#Y${index + 1}`, // Add sequential index as id
    //     _id: boatObj._id, // Preserve original _id
    //     price: `$${boatObj?.priceDetails?.hourly?.rate}` || `$${boatObj?.priceDetails?.daily?.rate}`
    //   };
    // });

    return {
      boats: filteredBoats,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    };
  } catch (error) {
    console.error("Error fetching boats:", error);
    throw new Error("Error fetching boats");
  }
};


// Helper function to calculate relevance score
const calculateRelevanceScore = (location, locationParts) => {
  let score = 0;

  // Check for matches and assign scores
  if (locationParts[0] && location.city.toLowerCase() === locationParts[0]) score += 3; // Exact city match
  if (locationParts[1] && location.state.toLowerCase() === locationParts[1]) score += 2; // Exact state match
  if (locationParts[2] && location.country.toLowerCase() === locationParts[2]) score += 1; // Exact country match

  return score;
};

const getBookingStatus = async (boat) => {
  const currentDate = new Date();

  // Check if the boat is under maintenance
  if (boat.status === 'maintenance') return 'Maintenance';
console.log(boat)
  // Check bookings for the yacht
  // Convert boat._id to string for comparison if needed
  const boatId = boat._id.toString();
  
  // Find bookings for this specific boat
  const bookings = await BookingModel.find({
    yachtId: boat._id, // Using yachtId instead of boatId based on DB schema
    status: { $in: ["pending", "confirmed", "booked"] },
    startDate: { $gte: currentDate }
  }).lean();
  
console.log(bookings)
  if (bookings.length === 0) return 'Available';

  const totalSlots = boat.capacity || 10; // Assuming capacity is the total slots available
  const bookedSlots = bookings.length;

  if (bookedSlots >= totalSlots) return 'Booked';
  return 'Partially Booked';
};

module.exports = {
  saveBoatData,
  getOwnerBoats,
  getAllBoats,
  getBoatDetails,
  editBoatData,
  deleteBoatData,
};
