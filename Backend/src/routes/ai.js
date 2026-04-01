const express = require('express');

const { runPlacementAnalysis, runTryOnAnalysis } = require('../../../Model/m');

const router = express.Router();

function buildViewerUrl(req, params) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/ai-viewer/${query ? `?${query}` : ''}`;
}

router.get('/viewer-url', (req, res) => {
  res.json({ viewerUrl: buildViewerUrl(req, {}) });
});

router.post('/tryon', (req, res) => {
  const { category, imageUri, productName } = req.body || {};
  const analysis = runTryOnAnalysis({ category, imageUri, productName });

  return res.json({
    ...analysis,
    viewerUrl: buildViewerUrl(req, {
      mode: 'tryon',
      category: analysis.category,
      product: analysis.productName || undefined,
    }),
  });
});

router.post('/detect', (req, res) => {
  const { seed, imageUri, productName, category } = req.body || {};
  const analysis = runPlacementAnalysis({ seed, imageUri });

  return res.json({
    ...analysis,
    viewerUrl: buildViewerUrl(req, {
      mode: 'placement',
      target: analysis.primaryObject ? analysis.primaryObject.name : 'scene',
      product: productName || undefined,
      category: category || undefined,
    }),
  });
});

module.exports = router;
