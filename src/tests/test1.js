const moment = require('moment');

// Function to calculate available times
function calculateAvailableTimes(existingBookings, startTime, endTime, bufferTime) {
  const availableTimes = [];

  // Define buffer time as a Moment.js duration
  const bufferDuration = moment.duration(bufferTime, 'minutes');

  // Convert time-only strings to full datetime strings for processing
  const startDateTime = moment().startOf('day').set({ hour: parseInt(startTime.split(':')[0]), minute: parseInt(startTime.split(':')[1]) });
  const endDateTime = moment().startOf('day').set({ hour: parseInt(endTime.split(':')[0]), minute: parseInt(endTime.split(':')[1]) });

  // Helper function to add available slots
  function addAvailableSlot(start, end) {
    const duration = moment.duration(moment(end).diff(moment(start))).asHours();
    if (duration >= 2) { // Ensuring the duration meets minimum hours requirement
      availableTimes.push({ start: start.format('HH:mm'), end: end.format('HH:mm'), duration });
    }
  }

  // Sort bookings by start time (parsing start_time and end_time from API format)
  existingBookings = existingBookings.map(booking => ({
    startTime: moment().startOf('day').set({ hour: parseInt(booking.start_time.split(':')[0]), minute: parseInt(booking.start_time.split(':')[1]) }),
    endTime: moment().startOf('day').set({ hour: parseInt(booking.end_time.split(':')[0]), minute: parseInt(booking.end_time.split(':')[1]) }),
  })).sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

  // Add slot before the first booking
  if (existingBookings.length > 0) {
    const firstBookingStart = moment(existingBookings[0].startTime);
    addAvailableSlot(startDateTime, firstBookingStart.subtract(bufferDuration));
  }

  // Iterate through bookings to calculate available slots
  for (let i = 0; i < existingBookings.length - 1; i++) {
    const currentBookingEnd = moment(existingBookings[i].endTime).add(bufferDuration);
    const nextBookingStart = moment(existingBookings[i + 1].startTime).subtract(bufferDuration);

    if (currentBookingEnd.isBefore(nextBookingStart)) {
      addAvailableSlot(currentBookingEnd, nextBookingStart);
    }
  }

  // Add slot after the last booking
  if (existingBookings.length > 0) {
    const lastBookingEnd = moment(existingBookings[existingBookings.length - 1].endTime);
    addAvailableSlot(lastBookingEnd.add(bufferDuration), endDateTime);
  } else {
    // If no bookings, add the entire slot from start to end
    addAvailableSlot(startDateTime, endDateTime);
  }

  return availableTimes;
}

module.exports = { calculateAvailableTimes };