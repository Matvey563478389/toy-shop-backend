const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user.controller')

userRouter.get('/users', userController.getUsers)
userRouter.post('/user', userController.createUser)
userRouter.post('/user/sign-up', userController.signUp)

module.exports = userRouter;