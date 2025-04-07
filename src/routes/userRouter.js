const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers, updateUserRole } = require('../controllers/usercontroller');
const { authorise } = require('../middlewares/authorise');
const userRouter = express.Router()



userRouter.get("/", getAllUsers);

userRouter.get('/:userId', getUserProfile);
userRouter.patch('/:userId', updateUserProfile);

userRouter.put("/:id/role", authorise(["b"]), updateUserRole);
// userRouter.delete("/:id", authorise["b"], deleteUser);





module.exports = userRouter;
