const express = require('express');

const { query } = require('../config/db');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();

router.get('/overview', verifyFirebaseToken, async (req, res) => {
  try {
    const models = await query(
      `SELECT
        p.id,
        p.name AS title,
        c.name AS category,
        p.image_url AS imageUrl,
        p.model_slug AS modelSlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id ASC`
    );

    const userRows = await query(`SELECT id FROM users WHERE firebase_uid = ? LIMIT 1`, [req.user.uid]);

    let snapshots = [];

    if (userRows[0]) {
      snapshots = await query(
        `SELECT
          CAST(th.id AS CHAR) AS id,
          COALESCE(p.name, 'AR Session') AS title,
          COALESCE(c.name, 'Saved try-on session') AS subtitle
        FROM tryon_history th
        LEFT JOIN products p ON p.id = th.product_id
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE th.user_id = ?
        ORDER BY th.created_at DESC
        LIMIT 10`,
        [userRows[0].id]
      );
    }

    if (snapshots.length === 0) {
      snapshots = models.slice(0, 3).map((item, index) => ({
        id: `seed-${item.id}-${index}`,
        title: item.title,
        subtitle: item.category || 'Saved workspace preview',
      }));
    }

    return res.json({ models, snapshots });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load workspace overview.', error: error.message });
  }
});

module.exports = router;
