const express = require('express');
const authRouter = express.Router()

const { registerController, loginController,googleSignIn  } = require('../controllers/authcontroller');


authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/google-signin', googleSignIn );




module.exports = authRouter;
