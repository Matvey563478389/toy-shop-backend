const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const toyRouter = require('./toy.route');
const orderRouter = require("./order.route");
const promoRouter = require('./promo.route');
const categoryRouter = require('./category.route');

router.use('/api', userRouter);
router.use('/api', toyRouter);
router.use('/api', orderRouter);
router.use('/api', promoRouter);
router.use('/api', categoryRouter);

module.exports = router;