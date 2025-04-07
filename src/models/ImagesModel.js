const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imgeUrl: {
    type: String,
    required: true,
  },
  altText: String,
  
  boatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boat',  // Reference to the Boat model
    required: true,
  },
  position:Number
},
  {
    timestamps: true,
    versionKey: false,
  }
);

const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;
