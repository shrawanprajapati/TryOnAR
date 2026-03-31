const express = require('express');

const { query } = require('../config/db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const products = await query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.image_url AS imageUrl,
        p.model_slug AS modelSlug,
        p.price,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id ASC`
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products.', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const products = await query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.image_url AS imageUrl,
        p.model_slug AS modelSlug,
        p.price,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(products[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load product.', error: error.message });
  }
});

module.exports = router;
