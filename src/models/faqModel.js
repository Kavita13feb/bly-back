const mongoose = require("mongoose");
const faqCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    order: { type: Number, default: 1 }, // For sorting categories
    faqCount: { type: Number, default: 0 }, // Automatically updated
    active: { type: Boolean, default: true },
    userType: { 
      type: String, 
      enum: ["renter", "owner", "both"], 
      default: "both"
    },
    icon: { type: String, trim: true } // FontAwesome or other icon reference
  },
  { timestamps: true, versionKey: false }
);

const faqSchema = new mongoose.Schema(

  {
    question: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true // Add index for better unique constraint performance
    },
    answer: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategory' },
    category: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    tags: [{ type: String }],
    relatedFaqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faq' }],
    userType: {
      type: String,
      enum: ["renter", "owner", "both"],
      default: "both",
    },
    showOnPages: [{ type: String }], // Pages where this FAQ should appear
    isVisible: { type: Boolean, default: true }, // Control visibility
    
  },
  { timestamps: true ,versionKey:false}
);


const FaqCategory = mongoose.model('FaqCategory', faqCategorySchema);


const FAQ = mongoose.model("FAQ", faqSchema);
  
module.exports = {FaqCategory,FAQ};
