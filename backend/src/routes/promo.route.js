const express = require('express');
const promoRouter = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const promoController = require('../controllers/promo.controller');

promoRouter.post('/promo-codes/check', protect, promoController.checkPromo);
promoRouter.get('/promo-codes', protect, isAdmin, promoController.listPromos);
promoRouter.post('/promo-codes', protect, isAdmin, promoController.createPromo);
promoRouter.put('/promo-codes/:id', protect, isAdmin, promoController.updatePromo);
promoRouter.delete('/promo-codes/:id', protect, isAdmin, promoController.deletePromo);

module.exports = promoRouter;
