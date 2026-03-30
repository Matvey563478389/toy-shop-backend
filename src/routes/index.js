const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const toyRouter = require('./toy.route');

router.use('/api', userRouter);
router.use('/api', toyRouter);

module.exports = router;