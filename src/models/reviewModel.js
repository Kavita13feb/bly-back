const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    userAvatar: { type: String, required: false },
    yachtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boat',
        required:false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required:false
    },
    category: { type: String, default: 'Other' },
    email: { type: String, required: false },
    userName: { type: String, required: false },
    yachtName: { type: String, required: false },
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    rating: { type: Number, required: false },
    profession: { type: String, required: false },
    company: { type: String, required: false }, 
    position: { type: String, required: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected',], default: 'pending' },
    type: { type: String, enum: ['review', 'testimonial', 'feedback'], default: 'review' },
    title: { type: String, required: false },
    comment: { type: String, required: false },
    responded: { type: Boolean, default: false },
    response: { type: String, required: false },
    responseDate: { type: Date, required: false },
    isTestimonial: { type: Boolean, default: false },
    serviceDate: { type: Date, required: false },
    photos: [String],
       
    
},{
    timestamps: true, 
    versionKey: false
  });
const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports=ReviewModel



// listing_accuracy: Number,
// listing_accuracy_comment: String,
// departure_and_return: Number,
// departure_and_return_comment: String,
// vessel_and_equipment: Number,
// vessel_and_equipment_comment: String,
// communication: Number,
// communication_comment: String,
// value: Number,
// value_comment: String,
// itinerary_and_experience: Number,
// itinerary_and_experience_comment: String,
// private_note: String,
// public_review: String,

// Sample data for MongoDB Compass
