const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const toyRouter = require('./toy.route');
const orderRouter = require("./order.route");

router.use('/api', userRouter);
router.use('/api', toyRouter);
router.use('/api', orderRouter)

module.exports = router;