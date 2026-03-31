const express = require('express');

const { query } = require('../config/db');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.post('/sync', verifyFirebaseToken, async (req, res) => {
  try {
    const email = req.user.email || req.body.email || null;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to sync the user.' });
    }

    await query(
      `INSERT INTO users (firebase_uid, email, name)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE email = VALUES(email), name = VALUES(name)`,
      [req.user.uid, email, req.user.name || null]
    );

    const rows = await query(
      `SELECT id, firebase_uid AS firebaseUid, email, name, created_at AS createdAt
       FROM users
       WHERE firebase_uid = ?
       LIMIT 1`,
      [req.user.uid]
    );

    return res.json({ message: 'User synced successfully.', user: rows[0] || null });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to sync user.', error: error.message });
  }
});

router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, firebase_uid AS firebaseUid, email, name, created_at AS createdAt
       FROM users
       WHERE firebase_uid = ?
       LIMIT 1`,
      [req.user.uid]
    );

    return res.json({
      uid: req.user.uid,
      email: req.user.email || null,
      name: req.user.name || null,
      databaseUser: rows[0] || null,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load profile.', error: error.message });
  }
});

module.exports = router;
