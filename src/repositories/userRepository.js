const { firestore } = require('../config/firebase');
const UserModel = require('../models/userModel');
const BookingModel = require('../models/bookingModel');
const { default: mongoose } = require('mongoose');
// Fetch user role from Firestore

const storeUserDeatils = async (user) => {
  try {
    const storedUser =await UserModel(user)
   
    await storedUser.save()
    return storedUser
  } catch (error) {
    throw new Error(`Error fetching user role: ${error.message}`);
  }
};



const getUserById = async (userId) => {

  try {
    const totalUserBookings = await BookingModel.countDocuments({ userId});
    // Get total amount spent by user across all bookings
    // Get total amount spent by user across all bookings
    const totalSpent = await BookingModel.aggregate([
      { $match: { userId:new mongoose.Types.ObjectId(userId) } },
      { $group: { 
        _id: null,
        total: { $sum: "$price" } 
      }}
    ]);
  
    const userTotalSpent = totalSpent.length > 0 ? totalSpent[0].total : 0;

const user = await UserModel
  .findById(userId)
  .select("-password")
  .lean(); 
    if (!user) {
      return null;
    }
console.log(user)
    // Format user details
    const formattedUser = {
      id: user._id.toString(),
      name: user.name || "Unknown",
      email: user.email || "N/A", 
      phone: user.phone || "N/A",
      role: user.role || "N/A",
      location: user?.location?.address || "N/A",
      profileImg: user.profilePic || "https://randomuser.me/api/portraits/men/11.jpg",
      createdAt: user.createdAt,
      bookings: totalUserBookings || 0,
      totalSpent: `$${userTotalSpent}` || 0
    };


    return { ...formattedUser, totalBookings: totalUserBookings }; // Exclude sensitive data like password
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};
const getUserByEmail = async (email) => {

  try {
    return await UserModel.findOne({email}).select('-password'); // Exclude sensitive data like password
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

const updateUserById = async (userId, updatedData) => {
  try {
    return await UserModel.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password'); // Exclude sensitive data like password
  } catch (error) {
    console.error('Error updating user by ID:', error);
    throw error;
  }
};




module.exports = { storeUserDeatils,getUserById ,updateUserById,getUserByEmail};
