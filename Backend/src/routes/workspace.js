const express = require('express');

const requireAuth = require('../middleware/requireAuth');
const { getWorkspacePayload } = require('../data/store');
const { products } = require('../data/catalog');

const router = express.Router();

router.get('/overview', requireAuth, (req, res) => {
  try {
    return res.json(getWorkspacePayload(req.user.id, products));
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not load workspace.' });
  }
});

module.exports = router;
