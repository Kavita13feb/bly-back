"use strict";

var express = require('express');

var _require = require('../controllers/usercontroller'),
    getUserProfile = _require.getUserProfile,
    updateUserProfile = _require.updateUserProfile,
    getAllUsers = _require.getAllUsers,
    updateUserRole = _require.updateUserRole;

var _require2 = require('../middlewares/authorise'),
    authorise = _require2.authorise;

var userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.get('/:userId', getUserProfile);
userRouter.patch('/:userId', updateUserProfile);
userRouter.put("/:id/role", authorise(["b"]), updateUserRole); // userRouter.delete("/:id", authorise["b"], deleteUser);

module.exports = userRouter;