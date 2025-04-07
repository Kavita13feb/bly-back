const { getUserByEmail } = require("../repositories/userRepository");
const { registerUser, loginUser } = require("../services/authService");
const admin=require(`../config/firebaseAdmin`);
const UserModel = require("../models/userModel");
const functions = require("firebase-functions");


const googleSignIn = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name } = decodedToken;
   
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        name,
        email,
      });
      await user.save();
    }
    res.status(200).json({
      message: 'User verified and saved successfully',
      user,
    });
    
  } catch (error) {
    console.error('Error verifying Google sign-in:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};




const registerController = async (req, res) => {
  const { idToken, name, email } = req.body;

  if (!idToken || !name || ! email ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  let userRecord = null; 
  try {
    // Verify the Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;
    const uid = decodedToken.uid;

    // Check if the user already exists in MongoDB
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Store user in MongoDB
    const user = await UserModel.create({
      uid,
      email,
      name,
    });

    res.status(201).json({ message: "User registered successfully", 
      status:"success",
      user:{
        id:user._id,
          email: user.email,
          name: user.name,
          role: user.role,
      },
   
      token: idToken, 

     
   } );
  } catch (error) {
    if (userRecord) {
      try {
        await admin.auth().deleteUser(userRecord.uid);
        console.log(`Rollback successful: Firebase user ${userRecord.uid} deleted`);
      } catch (rollbackError) {
        console.error("Rollback failed: Unable to delete Firebase user", rollbackError);
      }
    }

    res.status(500).json({ message: "Internal server error" });
  
  }
};



  const loginController = async (req, res) => {
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ message: "ID Token is required" });
    }
  
    try {
      // Step 1: Verify the Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // Extract the email from the decoded token
      const email = decodedToken.email;
  
      if (!email) {
        return res.status(400).json({ message: "Invalid ID Token" });
      }
  
      // Step 2: Check if the user is an admin in MongoDB
      const user = await UserModel.findOne({ email });
  console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // if (user.role !== "a") {
      //   return res.status(403).json({ message: "Access denied: Not an admin" });
      // }
  
      // Step 3: Respond with admin data
      res.status(200).json({
          status:"success",
          user:{
            id:user._id,
              email: user.email,
              name: user.name,
              role: user.role,
          },
       
          token: idToken, // Include the Firebase ID token

         
       });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };


module.exports={registerController,loginController,googleSignIn}