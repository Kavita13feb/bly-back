const { default: mongoose } = require("mongoose");
const UserModel = require("../models/userModel");
const { getUserById, updateUserById } = require("../repositories/userRepository");
const roleLabels = {
  a: "Platform Admin",
  b: "Yacht Owner",
  c: "Renter"
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(req.userId,userId)
    // if(req.userId.toString()!==userId.toString()){
    //   return res.status(401).json({ status: "failed", message: 'Not Authorised' }); 
    // }
    

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ status: "failed", message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedData = req.body;
    console.log(userId,updatedData)
    // Ensure the user has permission to update this profile
    // if(req.userId.toString()!==userId.toString()){
    //   return res.status(403).json({ status: "failed", message: 'Not Authorised' }); 
    // }
    // Map role to proper label if present in updatedData
    if (updatedData.role) {
      const roleKey = Object.keys(roleLabels).find(key => 
        roleLabels[key].toLowerCase() === updatedData.role.toLowerCase()
      );
      if (roleKey) {
        updatedData.role = roleKey;
      }
    }

    const updatedUser = await updateUserById(userId, updatedData);
console.log("updatedUser",updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: "failed", message: 'Server error' });
  }
};


// const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find();
//     res.status(200).json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// };


const getAllUsers = async (req, res) => {
  try {
    let {
      search = "",
      role, // ✅ Role filter: "admin", "owner", "user", etc.
      status, // ✅ Status filter if present (optional)
      location, // ✅ Optional filter by location
      sort = "createdAt", // ✅ Sort field (default: createdAt)
      order = "desc", // ✅ Sort order (asc/desc)
      page = 1, // ✅ Pagination
      limit = 5, // ✅ Items per page
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filters = {}; // ✅ Master Filter object
console.log(search)
    // 🔍 Search by Name or Email (Optional)
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filters.$or = [
        { name: regex },
        { email: regex },
        { userId: regex },
        { "location.city": regex },
        { "location.country": regex },
      ];
      
    if (mongoose.Types.ObjectId.isValid(search)) {
      filters.$or.push({ _id: new mongoose.Types.ObjectId(search) });
    }
    }

  
 
    // ✅ Role filter
    if (role) {
      filters.role = role; // Only users with this role
    }

    // ✅ Status filter (Optional, if you track active/inactive users)
    if (status) filters.status = new RegExp(`^${status}$`, "i");

    // ✅ Location Filter (Optional — check if users have 'location' field)
    if (location) {
      filters["$or"] = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }


    // ✅ Fetch Users
    const users = await UserModel.find(filters)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // to get plain JS objects

    // ✅ Prepare formatted response
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || "Unknown",
      email: user.email || "N/A",
      contact: user.contact || "N/A",
      role: roleLabels[user.role] || "N/A" ,// Role (Admin, Owner, User)
      status: user.status || "N/A", // Optional (Active/Inactive)
      location:
        user?.location?.city || user?.location?.state || user?.location?.country
          ? `${user?.location?.city || ""}, ${user?.location?.country || ""}`
          : "N/A",
      profileImg: user.profilePic || "https://randomuser.me/api/portraits/men/11.jpg", // Default avatar
      createdAt: user.createdAt, // Optional: when user was added
    }));

    // ✅ Total count for pagination
    const totalUsers = await UserModel.countDocuments(filters);

    // ✅ Final Response
    res.status(200).json({
      total: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateUserRole = async (req, res) => {
  try {   
    const { role } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { role }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User role updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getUserProfile,
  updateUserProfile
};
