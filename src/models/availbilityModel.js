const mongoose = require("mongoose");
const SlotSchema = new mongoose.Schema({
    start_time: {
      type: String,
      required: true, //  "HH:mm"
    },
    end_time: {
      type: String,
      required: true, //  "HH:mm"
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'], 
      required: true,
    },
    Is_available:Boolean,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', 
    }
  }, { _id: false });

  
const BoatAvailabilitySchema = new mongoose.Schema({
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boat', 
      required: true,
    },
    date: {
      type: Date,
      required: true, 
    },
    slots: [SlotSchema], 
    
  },{
  timestamps: true, 
  versionKey: false
});

BoatAvailabilitySchema.index({ boatId: 1, date: 1 }, { unique: true });
const BoatAvailabilityModel = mongoose.model("BoatAvailability", BoatAvailabilitySchema);
module.exports = BoatAvailabilityModel;


