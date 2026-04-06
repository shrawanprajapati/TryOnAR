const express = require('express');

const router = express.Router();

const DEFAULT_AI_VIEWER_URL = process.env.AI_VIEWER_URL || 'https://virtual-hat-glasses-try-on-booth.vercel.app';

function buildViewerUrl(params = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${DEFAULT_AI_VIEWER_URL}${query ? `?${query}` : ''}`;
}

router.get('/viewer-url', (_req, res) => {
  res.json({ viewerUrl: DEFAULT_AI_VIEWER_URL });
});

router.post('/tryon', (req, res) => {
  const { category, productName } = req.body || {};
  const resolvedCategory = category || 'Eyewear';

  return res.json({
    mode: 'tryon',
    category: resolvedCategory,
    productName: productName || null,
    confidence: 92,
    styleNote: `Open the hosted AR viewer to continue the ${resolvedCategory.toLowerCase()} preview.`,
    details: `${productName || resolvedCategory} is ready for live try-on in the hosted viewer.`,
    viewerUrl: buildViewerUrl({
      mode: 'tryon',
      category: resolvedCategory,
      product: productName || undefined,
    }),
  });
});

router.post('/detect', (req, res) => {
  const { category, productName } = req.body || {};
  const target = productName || category || 'scene';

  return res.json({
    mode: 'detect',
    primaryObject: {
      id: 'scene-anchor',
      name: target,
      confidence: 0.88,
      bounds: { x: 0.32, y: 0.24, width: 0.36, height: 0.42 },
    },
    candidates: [
      {
        id: 'scene-anchor',
        name: target,
        confidence: 0.88,
        bounds: { x: 0.32, y: 0.24, width: 0.36, height: 0.42 },
      },
    ],
    details: `${target} was prepared for spatial placement. Continue in the hosted viewer for the live AR experience.`,
    viewerUrl: buildViewerUrl({
      mode: 'placement',
      target,
      category: category || undefined,
      product: productName || undefined,
    }),
  });
});

module.exports = router;
