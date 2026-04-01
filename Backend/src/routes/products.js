const express = require('express');

const { products } = require('../data/catalog');

const router = express.Router();

router.get('/', (req, res) => {
  const query = String(req.query.q || '')
    .trim()
    .toLowerCase();

  if (!query) {
    return res.json(products);
  }

  const filteredProducts = products.filter((product) => {
    const haystack = [product.name, product.description, product.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return res.json(filteredProducts);
});

router.get('/:id', (req, res) => {
  const product = products.find((item) => String(item.id) === String(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  return res.json(product);
});

module.exports = router;
