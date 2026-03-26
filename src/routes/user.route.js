const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user.controller')

userRouter.get('/users', userController.getUsers)
userRouter.post('/user', userController.createUser)

module.exports = userRouter;