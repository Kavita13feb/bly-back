const { default: mongoose } = require("mongoose");
const {FAQ} = require("../models/faqModel");

const { FaqCategory } = require("../models/faqModel");

// Get all FAQ categories
exports.getAllFAQCategories = async (req, res) => {
  try {
    // Extract search and sort parameters from query
    const { search, sort = 'order', order = 'asc' } = req.query;
console.log(req.query)
    // Build filter object
    let filter = { active: true };
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Build sort object
    let sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    // Apply filter and sort to query
    const categories = await FaqCategory.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FaqCategory.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.json({
      categories,
      totalPages,
      totalCategories: total
    });

   
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQ categories", error });
  }
};

// Get single FAQ category by ID
exports.getFAQCategory = async (req, res) => {
  try {
    const category = await FaqCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "FAQ category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQ category", error });
  }
};

// Create new FAQ category
exports.createFAQCategory = async (req, res) => {
  try {

    console.log(req.body)
 const {name, description, slug, order, userType, icon} = req.body
    
    // Check if slug already exists
    const existingCategory = await FaqCategory.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this slug already exists" });
    }

    const category = await FaqCategory.create({
      name,
      description,
      slug,
      order,
      userType:"both",
      icon,
      active: true
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ category", error });
  }
};

// Update FAQ category
exports.updateFAQCategory = async (req, res) => {
  try {

    const { name, description, slug, order, userType, icon, active } = req.body;
    console.log(req.body)
    // Check if slug already exists for other categories
    const existingCategory = await FaqCategory.findOne({ 
      slug, 
      _id: { $ne: req.params.id } 
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this slug already exists" });
    }

    const category = await FaqCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        slug,
        order,
        userType,
        icon,
        active
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "FAQ category not found" });
    }
console.log(category)
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ category", error });
  }
};

// Delete FAQ category
exports.deleteFAQCategory = async (req, res) => {
  try {
    const category = await FaqCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "FAQ category not found" });
    }
    res.json({ message: "FAQ category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ category", error });
  }
};


exports.getAllFAQs = async (req, res) => {
  try {
    const { page = 1, limit = 5, sort = 'order', order = 'asc', search, category, status, featured } = req.query;

    // Build query object
    const query = {  };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } }
      ];
    }

    // Add category filter if provided
    if (category) {
      
      // Convert category ID to ObjectId if it's a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categoryId = new mongoose.Types.ObjectId(category);
      } else {
        query.categoryId = category;
      }
      // query.categoryId = category;

    }

    // Add status filter if provided  
    if (status) {
      query.status = status;
    }
console.log(featured)
    // Add featured filter if provided
    if (featured) {
      
      query.featured = featured === 'true';
    } 

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Get total count for pagination
    const total = await FAQ.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
      console.log(totalPages)  
      console.log(query) 
    // Get FAQs with pagination and sorting
    const faqs = await FAQ.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Send response with FAQs and pagination info
    res.json({
      faqs,
      currentPage: parseInt(page),
      totalPages,
      totalFaqs: total
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
};
// ✅ Get FAQs by category & user type
exports.getFAQs = async (req, res) => {
  try {
    const { category, userType } = req.params;
    
    // Find FAQs matching the category and userType (or both)
    const faqs = await FAQ.find({
      category,
      isVisible: true,
      $or: [{ userType }, { userType: "both" }], // Show FAQs for specific user or both
    }).sort({ order: 1 });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
};

// ✅ Search FAQs for specific user type
exports.searchFAQs = async (req, res) => {
  try {
    const { query, userType } = req.params;

    const faqs = await FAQ.find({
      $or: [
        { question: { $regex: query, $options: "i" } },
        { answer: { $regex: query, $options: "i" } },
      ],
      isVisible: true,
      $or: [{ userType }, { userType: "both" }], // Search within user type
    });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error searching FAQs", error });
  }
};

// ✅ Create a new FAQ (Admin only)
exports.createFAQ = async (req, res) => {
  try {
    console.log(req.body)
    // Convert categoryId string to ObjectId and fetch category name
    if (req.body.categoryId) {
    
      
      // Convert to ObjectId
      req.body.categoryId = new mongoose.Types.ObjectId(req.body.categoryId);
      
      // Fetch category name
      const category = await FaqCategory.findById(req.body.categoryId);
      if (category) {
        req.body.category = category.name;
        req.body.userType = "both";
      } else {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }
    const newFAQ = new FAQ(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error creating FAQ", error });
  }
};

// exports.createFAQ = async (req, res) => {
//   try {
//     const faqs = req.body; // Expecting either a single object or an array of objects

//     if (!Array.isArray(faqs)) {
//       // If it's a single object, convert it into an array for uniform handling
//       faqs = [faqs];
//     }

//     // Insert multiple FAQs in bulk
//     const createdFAQs = await FAQ.insertMany(faqs);

//     res.status(201).json({ message: "FAQs added successfully", data: createdFAQs });
//   } catch (error) {
//     res.status(400).json({ message: "Error creating FAQs", error });
//   }
// };


// ✅ Update an FAQ (Admin only)
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const updatedFAQ = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedFAQ);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error updating FAQ", error });
  }
};

// ✅ Delete an FAQ (Admin only)
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting FAQ", error });
  }
};


// category: {
//   type: String,
//   enum: ["platform", "yacht", "cancellation", "pricing", "general"],
//   // required: true,
// },