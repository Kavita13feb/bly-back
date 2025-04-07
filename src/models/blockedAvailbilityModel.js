const mongoose = require("mongoose");
const SlotSchema = new mongoose.Schema({
    startTime: {
      type: String,
      required: true, //  "HH:mm"
    },
    endTime: {
      type: String,
      required: true, //  "HH:mm"
    },
  
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', 
    }
  }, { _id: false });

  
const BlockedAvailabilitySchema = new mongoose.Schema({
    yachtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boat', 
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoatOwner', 
      required: true,
    },
    type: String, // "day" or "slots"
    date: {
      type: Date,
      required: true, 
    },
    reason: {
        type: String,
      //   required: true,
      },
    slots: [SlotSchema], 
    
  },{
  timestamps: true, 
  versionKey: false
});

BlockedAvailabilitySchema.index({ boatId: 1, date: 1 });
const BlockedAvailabilityModel = mongoose.model("BlockedAvailability", BlockedAvailabilitySchema);
module.exports = BlockedAvailabilityModel;


