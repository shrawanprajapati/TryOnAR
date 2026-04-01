const express = require('express');

const requireAuth = require('../middleware/requireAuth');
const { updateUser } = require('../data/store');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
  return res.json(req.user);
});

router.put('/me', requireAuth, (req, res) => {
  try {
    const user = updateUser(req.user.id, req.body || {});
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not update profile.' });
  }
});

module.exports = router;
