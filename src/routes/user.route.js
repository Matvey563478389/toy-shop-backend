const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user.controller')

userRouter.get('/users', userController.getUsers)
userRouter.post('/user/sign-up', userController.signUp)
userRouter.post('/user/sign-in', userController.signIn)

module.exports = userRouter;