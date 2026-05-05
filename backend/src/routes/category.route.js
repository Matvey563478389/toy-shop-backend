const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

categoryRouter.get('/categories', categoryController.listCategoriesPublic);
categoryRouter.get('/categories/admin', protect, isAdmin, categoryController.listCategoriesAdmin);
categoryRouter.post('/categories', protect, isAdmin, categoryController.createCategory);
categoryRouter.put('/categories/:id', protect, isAdmin, categoryController.updateCategory);
categoryRouter.delete('/categories/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = categoryRouter;
