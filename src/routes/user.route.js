const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user.controller')
const {protect} = require("../middleware/auth.middleware");
const { isAdmin } = require('../middleware/admin.middleware');

userRouter.get('/users', protect, isAdmin, userController.getUsers)
userRouter.post('/user/sign-up', userController.signUp)
userRouter.post('/user/sign-in', userController.signIn)
userRouter.get('/user/me', protect, userController.getMe);

module.exports = userRouter;