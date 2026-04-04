const orderController = require('../controllers/order.controller')
const express = require('express')
const {protect} = require("../middleware/auth.middleware");
const {isAdmin} = require("../middleware/admin.middleware");
const orderRouter = express.Router()

orderRouter.post('/order', protect, orderController.createOrder)
orderRouter.get('/order/my', protect, orderController.getMyOrders)
orderRouter.get('/order/all', protect, isAdmin, orderController.getAllOrders)
orderRouter.put('/order/:id', protect, isAdmin, orderController.updateStatus)

module.exports = orderRouter