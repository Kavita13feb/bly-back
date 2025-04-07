const BoatAvailabilityModel = require("../models/availbilityModel");

const getBoatAvailabilityController = async (req, res, next) => {
  try {
    // const userId = req.userId;
    const { boatId } = req.params;
    const { start_date, end_date } = req.query;

    const slots = await getBoatSlots(boatId, start_date, end_date);

    res.status(200).send({status:"success",data:slots});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createAvailabilityController = async (req, res, next) => {
    try {
      // const userId = req.userId;
      const { boatId } = req.params;
      const slotDetails = req.body;
  
      const slots = await createSlots(boatId,slotDetails);
  
      res.status(200).send({status:"success",data:slots});
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  
const getBoatSlots = async (boatId, start_date, end_date) => {

    try {
        const slots = BoatAvailabilityModel.find({
            boatId:boatId,
            date: { $gte: start_date, $lte: end_date }
          });
          console.log(slots)
          return slots    
    } catch (error) {
        console.log(error)
        throw error 
    }

};

const createSlots = async (boatId, slotDetails) => {
    try {
        // Find the document for the given boatId and date
        const existingSlot = await BoatAvailabilityModel.findOne({
            boatId: boatId,
            date: slotDetails.date
        });

        if (existingSlot) {
            // If the document exists, push the new slot details into the slots array
            existingSlot.slots.push({
                start_time: slotDetails.start_time,
                end_time: slotDetails.end_time,
                status: slotDetails.status,
                Is_available: slotDetails.Is_available
            });

            // Save the updated document
            await existingSlot.save();
            return existingSlot;
        } else {
            // If the document doesn't exist, create a new one
            const newSlot = new BoatAvailabilityModel({
                boatId,
                date: slotDetails.date,
                slots: [{
                    start_time: slotDetails.start_time,
                    end_time: slotDetails.end_time,
                    status: slotDetails.status,
                    Is_available: slotDetails.Is_available
                }]
            });

            await newSlot.save();
            return newSlot;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const calculateAvailableTimes = (existingBookings, startTime, endTime, bufferTime, minHours, maxHours) => {
  // Helper function to convert time strings to Date objects
  const toDate = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  // Helper function to convert Date objects to time strings
  const toTimeString = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Convert start and end times to Date objects
  const start = toDate(startTime);
  const end = toDate(endTime);

  // Sort existing bookings by start time
  existingBookings.sort((a, b) => toDate(a.startTime) - toDate(b.startTime));

  // Function to calculate gaps between existing bookings
  const getGapsBetweenBookings = (bookings, startTime, endTime) => {
    const gaps = [];
    let prevEndTime = startTime;

    for (const booking of bookings) {
      const bookingStart = toDate(booking.startTime);
      const bookingEnd = toDate(booking.endTime);

      if (bookingStart > prevEndTime) {
        gaps.push({ start: prevEndTime, end: bookingStart });
      }

      prevEndTime = bookingEnd;
    }

    if (endTime > prevEndTime) {
      gaps.push({ start: prevEndTime, end: endTime });
    }

    return gaps;
  };

  const gaps = getGapsBetweenBookings(existingBookings, start, end);

  // Calculate available hours and departure times
  const availableTimes = [];

  for (const gap of gaps) {
    const gapStart = gap.start;
    const gapEnd = gap.end;

    const gapDuration = (gapEnd - gapStart) / (1000 * 60 * 60); // Duration in hours

    if (gapDuration >= minHours) {
      let departureTime = gapStart;
      while (departureTime.getTime() + minHours * 60 * 60 * 1000 <= gapEnd.getTime()) {
        const bookingEnd = new Date(departureTime.getTime() + maxHours * 60 * 60 * 1000);

        if (bookingEnd <= gapEnd) {
          availableTimes.push({
            departure: toTimeString(departureTime),
            endTime: toTimeString(bookingEnd)
          });
        }

        departureTime = new Date(departureTime.getTime() + 30 * 60 * 1000); // Move to next available departure time with buffer
      }
    }
  }

  return availableTimes;
};

// Example usage
const existingBookings = [
  { startTime: '12:00', endTime: '14:00' },
];

const availableTimes = calculateAvailableTimes(
  existingBookings,
  '09:00',
  '21:00',
  0.5, // 30 minutes buffer
  2,   // Minimum hours
  8    // Maximum hours
);

console.log(availableTimes);


module.exports ={getBoatAvailabilityController,createAvailabilityController}
