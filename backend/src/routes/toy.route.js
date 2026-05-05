const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const toyController = require('../controllers/toy.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const uploadPath = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/toys/popular', toyController.getPopularToys);
router.get('/toys', toyController.getToys);
router.get('/toys/:id/related', toyController.getRelatedToys);
router.get('/toys/:id', toyController.getToyById);

router.post('/toys', protect, isAdmin, upload.single('image'), toyController.createToy);
router.put('/toys/:id', protect, isAdmin, upload.single('image'), toyController.updateToy);
router.delete('/toys/:id', protect, isAdmin, toyController.deleteToy);

module.exports = router;
