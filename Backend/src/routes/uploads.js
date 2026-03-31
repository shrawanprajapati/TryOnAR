const express = require('express');
const multer = require('multer');
const path = require('path');

const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post('/image', verifyFirebaseToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  return res.json({
    message: 'Image uploaded successfully.',
    imageUrl,
  });
});

module.exports = router;
