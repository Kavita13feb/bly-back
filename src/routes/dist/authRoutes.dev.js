"use strict";

var express = require('express');

var authRouter = express.Router();

var _require = require('../controllers/authcontroller'),
    registerController = _require.registerController,
    loginController = _require.loginController,
    googleSignIn = _require.googleSignIn;

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/google-signin', googleSignIn); // authRouter.post('/google', async (req, res) => {
//   try {
//     const { success, user, message } = await signInWithGoogle();
//     if (success) {
//       res.status(200).json({ success: true, user });
//     } else {
//       res.status(400).json({ success: false, message });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: `Server error: ${error.message}` });
//   }
// });

module.exports = authRouter;