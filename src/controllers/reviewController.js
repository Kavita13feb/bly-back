// const { getReviews, saveReviews } = require("../repositories/reviewsRepository");

// const addReview = async (req, res,next) => {
//     try {
//         const userId = req.userId;
//         const reviewDetails = req.body;
      
//         const Review = await saveReviews(userId, reviewDetails);
    
//         res.status(200).send(Review);
//       } catch (error) {
//         console.log(error);
//         next(error)
//       }
//   };

// const getReviwsAndTestimonials = async (req, res) => {
  
//   try {
//     const {yachtId} = req.params;
//     const Reviews = await getReviews(yachtId);

//     res.status(200).json({ status: "success", data: Reviews });
//   } catch (error) {
//     console.error('Error retrieving user profile:', error);
//     res.status(500).json({ status: "failed", message: 'Server error' });
//   }
// };

// const updateReviews = async (req, res) => {
//   try {
//     const reviewId = req.params.reviewId;
//     const reviewDetails = req.body;

//     // Ensure the user has permission to update this profile
//     if(req.userId.toString()!==userId.toString()){
//       return res.status(403).json({ status: "failed", message: 'Not Authorised' }); 
//     }

//     const updatedUser = await updateUserById(userId, updatedData);

//     if (!updatedUser) {
//       return res.status(404).json({ status: "failed", message: 'User not found' });
//     }

//     res.status(200).json({ status: "success", data: updatedUser });
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     res.status(500).json({ status: "failed", message: 'Server error' });
//   }
// };

// const deleteReviews = async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const updatedData = req.body;
  
//       // Ensure the user has permission to update this profile
//       if(req.userId.toString()!==userId.toString()){
//         return res.status(403).json({ status: "failed", message: 'Not Authorised' }); 
//       }
  
//       const updatedUser = await updateUserById(userId, updatedData);
  
//       if (!updatedUser) {
//         return res.status(404).json({ status: "failed", message: 'User not found' });
//       }
  
//       res.status(200).json({ status: "success", data: updatedUser });
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//       res.status(500).json({ status: "failed", message: 'Server error' });
//     }
//   };


// module.exports = {
//  addReview,
//  getReviwsAndTestimonials,
//  updateReviews,
//  deleteReviews
// };


const ReviewModel = require('../models/reviewModel');

// Get reviews and testimonials with filtering, sorting and pagination
const getReviwsAndTestimonials = async (req, res) => {

  try {
    const { 
      page = 1, 
      limit = 5,
      order = 'desc',
      sort = '-createdAt',
      rating,
      category,
      type,
      status,
      featured,
      yachtId,
      search,

    } = req.query;

    // Build filter object
    const filter = {};
    
    if (rating) filter.rating = rating;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';
    if (yachtId) filter.yachtId = yachtId;
    if (search) {
      filter.$or = [
        
        { userName: { $regex: search, $options: 'i' } },
        { yachtName: { $regex: search, $options: 'i' } },
       
      ];
    }

    // Get total count for pagination
    const total = await ReviewModel.countDocuments(filter);
    // Handle sort direction
    const sortDirection = order === 'asc' ? 1 : -1;
    // If sort is 'date', use 'createdAt' field
    // If sort is 'name', use 'userName' field
    let sortField;
    if (sort === 'date') {
      sortField = 'createdAt';
    } else if (sort === 'name') {
      sortField = 'userName';
    } else {
      sortField = sort;
    }
    // Build sort object
    const sortObj = {};
    sortObj[sortField] = sortDirection;
   console.log(sortObj)
    // Get paginated and sorted results
    const reviews = await ReviewModel.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name profilePicture')
      .populate('yachtId', 'name images');
    // Format data for frontend use
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      userName: review.userName,
      userAvatar: review.userAvatar,
      yachtName: review.yachtName,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: review.createdAt.toISOString().split('T')[0],
      status: review.status,
      featured: review.featured,
      responded: review.responded,
      response: review.response,
      responseDate: review.responseDate ? review.responseDate.toISOString().split('T')[0] : null,
      category: review.category,
      type: review.type,
      verified: review.verified,
      position: review.position,
      profession: review.profession,
      photos: review.photos
    }));

    res.status(200).json({
      status: 'success',
      data: {
        reviews: formattedReviews,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalResults: total
      }
    });

  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ status: 'failed', message: 'Server error' });
  }
};

// Add new review or testimonial
const addReview = async (req, res) => {
  console.log(req.body)
  try {
    // Set isTestimonial to true if type is testimonial
    if (req.body.type === 'testimonial') {
      req.body.isTestimonial = true;
    }
    const reviewData = {
      ...req.body,
      // userId: req.userId // From auth middleware
    };

    const review = new ReviewModel(reviewData);
    await review.save();
     console.log(review)
    res.status(200).json({
      status: 'success',
      message: 'Review added successfully',
      data: review
    });

  } catch (error) {
    console.log(error)
    console.error('Error adding review:', error);
    res.status(500).json({ status: 'failed', message: 'Server error' });
  }
};

// Update review or testimonial
const updateReviews = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updateData = req.body;

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ status: 'failed', message: 'Review not found' });
    }
    // Check if user owns this review or is admin
    // const isAdmin = req.user && req.user.role === 'admin';
    // const isOwner = review.userId.toString() === req.userId.toString();

    // // Only allow status updates from admin
    // if (!isOwner && !isAdmin) {
    //   return res.status(403).json({ status: 'failed', message: 'Not authorized' });
    // }

    // If not admin, remove status field from update
    // Only allow admin to update status
    // if (isAdmin && updateData.status) {
    //   if (!['pending', 'approved', 'rejected'].includes(updateData.status)) {
    //     return res.status(400).json({ 
    //       status: 'failed', 
    //       message: 'Invalid status value. Must be pending, approved, or rejected'
    //     });
    //   }
      
    // }
   
    // Check if user owns this review or is admin 
    // if (review.userId.toString() !== req.userId.toString()) {
    //   return res.status(403).json({ status: 'failed', message: 'Not authorized' });
    // }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ status: 'failed', message: 'Server error' });
  }
};

// Delete review or testimonial
const deleteReviews = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ status: 'failed', message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    // if (review.userId.toString() !== req.userId.toString()) {
    //   return res.status(403).json({ status: 'failed', message: 'Not authorized' });
    // }

    await ReviewModel.findByIdAndDelete(reviewId);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ status: 'failed', message: 'Server error' });
  }
};

module.exports = {
  getReviwsAndTestimonials,
  addReview,
  updateReviews,
  deleteReviews
};





