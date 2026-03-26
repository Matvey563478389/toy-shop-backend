const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user/user.controller')

userRouter.get('/users', userController.getUsers)

module.exports = userRouter;