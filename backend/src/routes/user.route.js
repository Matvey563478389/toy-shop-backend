const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user.controller')
const {protect} = require("../middleware/auth.middleware");
const { isAdmin } = require('../middleware/admin.middleware');

userRouter.get('/users', protect, isAdmin, userController.getUsers)
userRouter.delete('/users/:id', protect, isAdmin, userController.deleteUser)
userRouter.post('/user/sign-up', userController.signUp)
userRouter.put('/user/profile', protect, userController.updateProfile)
userRouter.post('/user/sign-in', userController.signIn)
userRouter.post('/user/refresh', userController.refreshSession)
userRouter.post('/user/logout', protect, userController.logout)
userRouter.get('/user/me', protect, userController.getMe);

module.exports = userRouter;