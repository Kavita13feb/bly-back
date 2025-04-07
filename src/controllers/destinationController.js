const BoatModel = require("../models/boatModel");
const Destination = require("../models/destinationModal");

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({
      status: "success",
      results: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get single destination by ID or slug
exports.getDestination = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!destination) {
      return res.status(404).json({
        status: "fail",
        message: "Destination not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: destination,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// Update destinations from yacht data
exports.updateDestinationsFromYachts = async (req, res) => {
  try {
    // Get yacht data aggregated by location

    const yachtAggregation = await BoatModel.aggregate([


      {
        $match: {
          "location.city": { $exists: true },
          "location.country": { $exists: true },
        },
      },
      {
        $project: {
          location: {
            $concat: ["$location.city", ", ", "$location.country"],
          },
          coordinates: [
            "$location.geoPoint.coordinates[0]",
            "$location.geoPoint.coordinates[1]",
          ],
          bookings: 1,
        },
      },

      {
        $group: {
          _id: "$location",
          yachtCount: { $sum: 1 },
          bookingCount: { $sum: "$bookings.length" },
          coordinates: { $first: "$coordinates" },
        },
      },
    ]);
    console.log(yachtAggregation);
    // Update or create destinations based on yacht data
    for (const location of yachtAggregation) {
      const slug = location._id.toLowerCase().replace(/\s+/g, "-");
      // Get minimum price of yachts in this location
      const minPriceAggregation = await BoatModel.aggregate([
        {
          $match: {
            "location.city": location._id.split(", ")[0],
            "location.country": location._id.split(", ")[1],
            $or: [
              { "priceDetails.hourly.rate": { $exists: true, $gt: 0 } },
              { "priceDetails.daily.rate": { $exists: true, $gt: 0 } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            minPrice: {
              $min: {
                $cond: {
                  if: {
                    $and: [
                      { $gt: ["$priceDetails.hourly.rate", 0] },
                      { $gt: ["$priceDetails.daily.rate", 0] },
                    ],
                  },
                  then: {
                    $min: [
                      "$priceDetails.hourly.rate",
                      { $divide: ["$priceDetails.daily.rate", 24] },
                    ],
                  },
                  else: {
                    $cond: {
                      if: { $gt: ["$priceDetails.hourly.rate", 0] },
                      then: "$priceDetails.hourly.rate",
                      else: { $divide: ["$priceDetails.daily.rate", 24] },
                    },
                  },
                },
              },
            },
            priceUnit: { $first: "hour" },
            
          },
        },
      ]);

      const minPrice =minPriceAggregation.length > 0 ? minPriceAggregation[0].minPrice : 0;
      const unit =minPriceAggregation.length > 0 ? minPriceAggregation[0].priceUnit : "hour";

      const destination = await Destination.findOneAndUpdate(
        { slug: slug },
        {
          city: location._id.split(", ")[0],
          country: location._id.split(", ")[1],
          name: location._id,
          slug: slug,
          yachtCount: location.yachtCount,
          bookingCount: location.bookingCount,
          status: "active",
          price: `$${minPrice}/${unit}`,
          pricing: {
            amount: minPrice,
            currency: "$",
            unit: unit,
          },
          geoPoint: {
            type: "Point",
            coordinates: location.coordinates,
          },
          $setOnInsert: {
            description: `Explore ${location._id}`,
            shortDescription: `Discover yachting in ${location._id}`,
            region: "", // To be updated by admin
            popularActivities: [],
            bestTimeToVisit: {
              months: [],
              notes: "",
            },
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(destination);
     }


    // Set destinations with no yachts to inactive
    await Destination.updateMany(
      {
        slug: {
          $nin: yachtAggregation.map((l) =>
            l._id.toLowerCase().replace(/\s+/g, "-")
          ),
        },
      },
      {
        status: "inactive",
      }
    );

    res.status(200).json({
      status: "success",
      message: "Destinations updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Create new destination
exports.createDestination = async (req, res) => {
  try {
    const newDestination = await Destination.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDestination,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update destination
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!destination) {
      return res.status(404).json({
        status: "fail",
        message: "Destination not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: destination,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete destination
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        status: "fail",
        message: "Destination not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get featured destinations
exports.getFeaturedDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ featured: true });
    res.status(200).json({
      status: "success",
      results: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Search destinations by region
exports.searchByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const destinations = await Destination.find({
      region: { $regex: region, $options: "i" },
    });

    res.status(200).json({
      status: "success",
      results: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update destination rating
exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        status: "fail",
        message: "Destination not found",
      });
    }

    const newAverageRating =
      (destination.rating.averageRating * destination.rating.totalReviews +
        rating) /
      (destination.rating.totalReviews + 1);

    destination.rating.averageRating = newAverageRating;
    destination.rating.totalReviews += 1;
    await destination.save();

    res.status(200).json({
      status: "success",
      data: destination,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// Sample yacht data for MongoDB Atlas import
[
  {
    "_id": {"$oid": "6761780386d6c0b10b092fdf"},
    "location": {
      "geopoint": {
        "type": "Point",
        "coordinates": [151.5931794, -33.0133179]
      },
      "city": "Toronto",
      "state": "NSW", 
      "country": "Australia",
      "address": "Toronto NSW, Australia"
    },
    "features": {
      "make": {"$oid": "6753bbe3cf765f124e2a8525"},
      "model": "Oceanus 28 VST",
      "year": 2009,
      "length": 90,
      "engines": [
        {
          "number_engines": "543",
          "engine_horsepower": 934,
          "engine_brand": "87tygb",
          "engine_model": "978yhu",
          "fuelType": "Diesel",
          "_id": {"$oid": "676178fe86d6c0b10b093010"}
        }
      ],
      "amenities": [
        {"$oid": "6757c7bed4fbd650ff0601b9"},
        {"$oid": "6757c7bed4fbd650ff0601ba"},
        {"$oid": "6761774d3255376bb7c03235"},
        {"$oid": "6761774d3255376bb7c03237"},
        {"$oid": "6761774d3255376bb7c03238"},
        {"$oid": "6761774d3255376bb7c03239"},
        {"$oid": "6761774d3255376bb7c03233"},
        {"$oid": "6761774d3255376bb7c03232"},
        {"$oid": "6761774d3255376bb7c03231"},
        {"$oid": "6761774d3255376bb7c03236"},
        {"$oid": "6761774d3255376bb7c03234"},
        {"$oid": "6761774d3255376bb7c03230"},
        {"$oid": "6757c7bed4fbd650ff0601bd"},
        {"$oid": "6757c7bed4fbd650ff0601bc"},
        {"$oid": "676bb924c0f2f1932e3ae8dd"}
      ]
    },
    "priceDetails": {
      "daily": {
        "rate": 0,
        "minDays": 0,
        "maxDays": 30
      },
      "hourly": {
        "rate": 120,
        "minDuration": 2,
        "maxDuration": 12
      },
      "person": {
        "rate": 0,
        "minPersons": 1
      },
      "currency": {
        "code": "USD",
        "symbol": "$"
      },
      "captainProvided": true,
      "captainPrice": 70
    },
    "ownerId": {"$oid": "6759244971ee2061ba7b4249"},
    "title": "House Boat 0456",
    "status": "Approved",
    "isLive": true,
    "stepCompleted": 3,
    "capacity": 25,
    "shortName": "Toronto yacht",
    "short_description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
    "description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
    "securityAllowance": 454,
    "averageRating": 0,
    "rating": 5,
    "createdAt": {"$date": "2024-12-17T13:09:23.778Z"},
    "updatedAt": {"$date": "2025-03-01T09:52:34.614Z"}
  },
  {
    "_id": {"$oid": "66cd94ad16d65b2324ac92e4"},
    "location": {
      "geopoint": {
        "type": "Point",
        "coordinates": [-80.1917902, 25.7616798]
      },
      "city": "Miami",
      "state": "Florida",
      "country": "USA",
      "address": "123 Marina Blvd, Miami, Florida"
    },
    "features": {
      "make": "Custom",
      "model": "Bottom Glass",
      "length": 45,
      "year": 2000,
      "engines": [
        {
          "number_engines": "2",
          "engine_horsepower": 300,
          "engine_brand": "Yamaha",
          "engine_model": "V8",
          "fuelType": "Diesel",
          "_id": {"$oid": "66f6e697e6f795bf92c80a6b"}
        }
      ],
      "amenities": []
    },
    "priceDetails": {
      "daily": {
        "rate": 100,
        "minDays": 1,
        "maxDays": 5
      },
      "hourly": {
        "rate": 20,
        "minDuration": 2,
        "maxDuration": 8
      },
      "person": {
        "rate": 50,
        "minPersons": 5
      },
      "currency": {
        "code": "USD",
        "symbol": "$"
      },
      "captainProvided": true,
      "captainPrice": 100
    },
    "ownerId": {"$oid": "6759244971ee2061ba7b4249"},
    "title": "Celebrate your Yacht Party up to 34PAX, Everything Included, Great Location",
    "status": "pending",
    "isLive": false,
    "stepCompleted": 0,
    "capacity": 13,
    "shortName": "Celebrate Yacht Party",
    "short_description": "Experience the ultimate luxury on the water with a custom yacht for your party.",
    "description": "This luxury yacht offers a spacious deck, modern amenities, and a professional crew to ensure your comfort.",
    "averageRating": 4.5,
    "rating": 4.5,
    "createdAt": {"$date": "2024-08-27T08:56:13.967Z"},
    "updatedAt": {"$date": "2025-04-04T05:13:05.800Z"}
  }
]
