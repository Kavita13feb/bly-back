const { auth, createUserWithEmailAndPassword ,firestore ,provider, signInWithPopup,signInWithEmailAndPassword} = require('../config/firebase');
const { storeUserDeatils } = require('../repositories/userRepository');
const CustomError = require('../utils/customError');
const UserModel = require('../models/userModel');
// Register a new user
const registerUser = async (name,email, password) => {
  try {
    // Create user with email and password
    
    const userCredential = await createUserWithEmailAndPassword(auth,email, password);
   console.log(userCredential)

   let user = await storeUserDeatils({
     name,
     email
 
    })
   

    return {msg:"Registration Successful",status:"success",user};
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};


const loginUser = async (email, password) => {
  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(auth,email, password);
    console.log(userCredential)
    const user = userCredential.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    return { user, idToken };
  } catch (error) {
   console.log(error)
    throw error

    

  }
};






module.exports = { registerUser, loginUser };
