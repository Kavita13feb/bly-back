const bookingModel = require("../models/bookingModel");
const VisitorModel = require("../models/visitorsModel");
const visitorModel = require("../models/visitorsModel");
// const { generateVisitorId } = require("../utils/idGenerator");

// ✅ Add or Update Visitor
const addVisitor = async (req, res) => {
  try {
    const { ipAddress, country } = req.body;

    let existingVisitor = await VisitorModel.findOne({ ipAddress });

    if (existingVisitor) {
      // Update last visit and mark as returning
      existingVisitor.lastVisit = new Date();
      existingVisitor.isReturning = true;
      await existingVisitor.save();

      return res.status(200).json({
        message: "Returning visitor updated successfully",
        visitor: existingVisitor,
      });
    }

    // New Visitor
    const newVisitor = new VisitorModel({
      visitorId: generateVisitorId(),
      ipAddress,
      country,
      firstVisit: new Date(),
      lastVisit: new Date(),
      isReturning: false,
    });

    await newVisitor.save();

    res.status(201).json({
      message: "New visitor added successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    console.error("Error adding visitor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Visitors (Paginated & Filtered)
const getAllVisitors = async (req, res) => {
  try {
    const {
      search = "", // Search by IP or Country
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query["$or"] = [
        { ipAddress: { $regex: search.trim(), $options: "i" } },
        { country: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const totalVisitors = await VisitorModel.countDocuments(query);

    const visitors = await VisitorModel.find(query)
      .sort({ lastVisit: -1 }) // Most recent visitors first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      total: totalVisitors,
      page: parseInt(page),
      totalPages: Math.ceil(totalVisitors / limit),
      limit: parseInt(limit),
      data: visitors,
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVisitorTrends = async (req, res) => {
  try {
    let { weeks = 6 } = req.query; // Default to last 6 weeks if not provided
    weeks = parseInt(weeks);

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - weeks * 7); // Go back 'n' weeks

    console.log("Fetching visitor trends from:", startDate.toISOString());

    // Fetch visitors in date range
    const visitors = await visitorModel
      .find({
        firstVisit: { $gte: startDate },
      })
      .lean();

    console.log("Fetched visitors:", visitors.length);

    // Prepare week slots
    const weekSlots = [];
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date();
      weekStart.setDate(now.getDate() - (weeks - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      weekSlots.push({ start: weekStart, end: weekEnd });
    }

    console.log("Week slots:", weekSlots);

    // Initialize result arrays
    const newVisitors = Array(weeks).fill(0);
    const returningVisitors = Array(weeks).fill(0);

    // Iterate over visitors and put them in the correct week slot
    visitors.forEach((visitor) => {
      for (let i = 0; i < weekSlots.length; i++) {
        if (
          visitor.firstVisit >= weekSlots[i].start &&
          visitor.firstVisit <= weekSlots[i].end
        ) {
          if (visitor.isReturning) {
            returningVisitors[i]++;
          } else {
            newVisitors[i]++;
          }
          break; // Once matched, break out of week loop
        }
      }
    });

    // Prepare final labels like "Week 1", "Week 2", ..., "Week 6"
    const weekLabels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);

    // Final response
    const response = {
      weeks: weekLabels,
      newVisitors,
      returningVisitors,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating visitor trends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Country to Region Mapping (add more as needed)
const getVisitorBookingAnalytics = async (req, res) => {
  try {
    const { region } = req.query;

    const visitorMatchStage = region ? { region } : {};
    const bookingMatchStage = region ? { "location.region": region } : {};
    // 📊 Aggregate Visitor Data by countryCode
    const visitorAggregation = await VisitorModel.aggregate([
      { $match: visitorMatchStage },
      {
        $group: {
          _id: "$countryCode",
          visitors: { $sum: 1 },
          region: { $first: "$region" },
          name: { $first: "$country" },
        },
      },
    ]);
    
    const bookingAggregation = await bookingModel.aggregate([
      { $match: bookingMatchStage },
      {
        $group: {
          _id: "$location.countryCode",
          bookings: { $sum: 1 },
          region: { $first: "$location.region" },
          name: { $first: "$location.country" },
        },
      },
    ]);
    // 🧠 Combine both into a single map
    const dataMap = {};

    visitorAggregation.forEach((entry) => {
      const code = entry._id;
      dataMap[code] = {
        visitors: entry.visitors,
        bookings: 0,
        region: entry.region || "Unknown",
        name: entry.name || code,
      };
    });

    bookingAggregation.forEach((entry) => {
      const code = entry._id;
      if (!dataMap[code]) {
        dataMap[code] = {
          visitors: 0,
          bookings: entry.bookings,
          region: entry.region || "Unknown",
          name: entry.name || code,
        };
      } else {
        dataMap[code].bookings = entry.bookings;
      }
    });

    res.status(200).json(dataMap);
  } catch (err) {
    console.error("❌ Error in visitor-booking analytics:", err);
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};

const trackVisitor = async (req, res) => {
  try {
    const {
      ip,
      country,
      city,
      state,
      countryCode,
      stateCode,
      postalCode,
      latitude,
      longitude,
      deviceType,
      browser,
      referrer,
    } = req.body;

    // Generate a unique visitor ID if not provided (can use cookies instead)
    const visitorId =
      req.cookies.visitorId ||
      `VIS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Check if the visitor already exists
    let existingVisitor = await VisitorModel.findOne({ visitorId });

    if (existingVisitor) {
      // ✅ Returning visitor: Update lastVisit & increment visitCount
      existingVisitor.lastVisit = new Date();
      existingVisitor.visitCount += 1;
      existingVisitor.isReturning = true;

      await existingVisitor.save();
    } else {
      // ✅ New visitor: Create a new entry
      const newVisitor = new VisitorModel({
        visitorId,
        ipAddress: ip,
        country,
        countryCode,
        state,
        stateCode,
        city,
        postalCode,
        latitude,
        longitude,
        deviceType,
        browser,
        referrer,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
        isReturning: false,
      });

      await newVisitor.save();

      // Store visitor ID in a cookie (optional)
      res.cookie("visitorId", visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    res
      .status(200)
      .json({ message: "Visitor tracked successfully", visitorId });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addVisitor,
  getAllVisitors,
  getVisitorTrends,
  getVisitorBookingAnalytics,
};
