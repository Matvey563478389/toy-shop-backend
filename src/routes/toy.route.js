const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const toyController = require('../controllers/toy.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/'), // Папка на сервере
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/toys', toyController.getToys);

router.post('/toys', protect, isAdmin, upload.single('image'), toyController.createToy);
router.put('/toys/:id', protect, isAdmin, upload.single('image'), toyController.updateToy);
router.delete('/toys/:id', protect, isAdmin, toyController.deleteToy);

module.exports = router;