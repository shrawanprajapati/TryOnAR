const express = require('express');

const {
  authenticateUser,
  createSession,
  createUser,
  deleteSession,
} = require('../data/store');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/signup', (req, res) => {
  try {
    const user = createUser(req.body || {});
    const session = createSession(user.id);
    return res.status(201).json(session);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not create account.' });
  }
});

router.post('/login', (req, res) => {
  try {
    const user = authenticateUser(req.body || {});
    const session = createSession(user.id);
    return res.json(session);
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Login failed.' });
  }
});

router.post('/logout', requireAuth, (req, res) => {
  deleteSession(req.authToken);
  return res.json({ success: true });
});

module.exports = router;
