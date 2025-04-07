const YachtTypeModal = require('../models/yachtTypesModel');

// Get all yacht types
const getAllYachtTypes = async (req, res) => {

  try {
    const yachtTypeModals = await YachtTypeModal.find({});
    res.status(200).json({
      success: true,
      data: yachtTypeModals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching yacht types',
      error: error.message
    });
  }
};

// Get single yacht type by slug
const getYachtTypesBySlug = async (req, res) => {
  try {
    const yachtTypeModal = await YachtTypeModal.findOne({ 
      slug: req.params.slug,
      status: 'active'
    });

    if (!yachtTypeModal) {
      return res.status(404).json({
        success: false,
        message: 'Yacht type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: yachtTypeModal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching yacht type',
      error: error.message
    });
  }
};

// Create new yacht type
const createYachtType = async (req, res) => {
  try {
    const yachtTypeModal = await YachtTypeModal.create(req.body);
    res.status(201).json({
      success: true,
      data: yachtTypeModal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating yacht type',
      error: error.message
    });
  }
};

// Update yacht type
const updateYachtType = async (req, res) => {
  try {
    const yachtTypeModal = await YachtTypeModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!yachtTypeModal) {
      return res.status(404).json({
        success: false,
        message: 'Yacht type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: yachtTypeModal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating yacht type',
      error: error.message
    });
  }
};

// Delete yacht type (soft delete by setting status to archived)
const deleteYachtType = async (req, res) => {
  try {
    const yachtTypeModal = await YachtTypeModal.findByIdAndUpdate(
      req.params.id,
      { status: 'archived', updatedAt: Date.now() },
      { new: true }
    );

    if (!yachtTypeModal) {
      return res.status(404).json({
        success: false,
        message: 'Yacht type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Yacht type archived successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting yacht type',
      error: error.message
    });
  }
};

module.exports = {
  getAllYachtTypes,
  getYachtTypesBySlug,
  createYachtType,
  updateYachtType,
  deleteYachtType
};



[
     {
     "title": "Motorboat",
     "slug": "motorboat",
     "description": "Fast and agile motorboats for quick adventures and water sports.",
     "image": "https://example.com/images/motorboat.jpg",
     "popular": true,
     "status": "active",
     "displayOrder": 2,
     "features": ["Speed control", "Safety equipment", "Easy handling"],
     "priceRange": { "min": 100, "max": 1000, "currency": "€" },
     "price": "$100/day",
     "totalYachts": 200,
     "averageRating": 4.5,
     "totalBookings": 1200,
     "seoMetadata": {
       "metaTitle": "Speedy Motorboats",
       "metaDescription": "Experience thrilling rides with our range of motorboats.",
       "keywords": ["Motorboat", "Speed Boats", "Water Sports"]
     },
     "experienceLevel": "Intermediate",
     "adventureTypes": [],
     "createdAt": { "$date": "2025-03-30T10:00:00.000Z" },
     "updatedAt": { "$date": "2025-03-30T10:00:00.000Z" }
   },{
     "title": "Catamaran",
     "slug": "catamaran",
     "description": "Spacious multi-hulled boats for smooth sailing and luxurious comfort.",
     "image": "https://example.com/images/catamaran.jpg",
     "popular": true,
     "status": "active",
     "displayOrder": 3,
     "features": ["Wide deck space", "Stable sailing", "Luxury cabins"],
     "priceRange": { "min": 300, "max": 4000, "currency": "€" },
     "price": "$300/day",
     "totalYachts": 80,
     "averageRating": 4.7,
     "totalBookings": 1000,
     "seoMetadata": {
       "metaTitle": "Luxury Catamarans",
       "metaDescription": "Enjoy smooth sailing with our range of catamarans.",
       "keywords": ["Catamaran", "Multi-hull Boats", "Luxury Yachts"]
     },
     "experienceLevel": "Advanced",
     "adventureTypes": [],
     "createdAt": { "$date": "2025-03-30T10:00:00.000Z" },
     "updatedAt": { "$date": "2025-03-30T10:00:00.000Z" }
   }, 
    {
     "title": "Gulet",
     "slug": "gulet",
     "description": "Traditional Turkish wooden boats offering a charming sailing experience.",
     "image": "https://example.com/images/gulet.jpg",
     "popular": false,
     "status": "active",
     "displayOrder": 4,
     "features": ["Wooden construction", "Classic styling", "Comfortable cabins"],
     "priceRange": { "min": 400, "max": 3500, "currency": "€" },
     "price": "$400/day",
     "totalYachts": 40,
     "averageRating": 4.4,
     "totalBookings": 600,
     "seoMetadata": {
       "metaTitle": "Charming Gulets",
       "metaDescription": "Experience traditional sailing with our elegant gulets.",
       "keywords": ["Gulet", "Traditional Boats", "Wooden Boats"]
     },
     "experienceLevel": "Intermediate",
     "adventureTypes": [],
     "createdAt": { "$date": "2025-03-30T10:00:00.000Z" },
     "updatedAt": { "$date": "2025-03-30T10:00:00.000Z" }
   },{
     "title": "Power Catamaran",
     "slug": "power-catamaran",
     "description": "Powerful and stable multi-hulled boats for smooth cruising.",
     "image": "https://example.com/images/power-catamaran.jpg",
     "popular": true,
     "status": "active",
     "displayOrder": 5,
     "features": ["Dual engines", "Luxurious cabins", "Ample deck space"],
     "priceRange": { "min": 600, "max": 6000, "currency": "€" },
     "price": "$600/day",
     "totalYachts": 70,
     "averageRating": 4.9,
     "totalBookings": 900,
     "seoMetadata": {
       "metaTitle": "Powerful Catamarans",
       "metaDescription": "Explore the waters with our luxurious power catamarans.",
       "keywords": ["Power Catamaran", "Luxury Catamarans", "High-Speed Yachts"]
     },
     "experienceLevel": "Advanced",
     "adventureTypes": [],
     "createdAt": { "$date": "2025-03-30T10:00:00.000Z" },
     "updatedAt": { "$date": "2025-03-30T10:00:00.000Z" }
   }
   
   ]