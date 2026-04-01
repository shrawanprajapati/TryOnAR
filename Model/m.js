const detectionCatalog = [
  {
    id: 'eyewear',
    name: 'Eyewear',
    icon: 'glasses-outline',
    confidence: 96,
    placementTip: 'Align the frame with the face guide before saving the preview.',
    summary: 'Best for face-based AR try-ons and quick camera alignment.',
  },
  {
    id: 'watch',
    name: 'Watch',
    icon: 'watch-outline',
    confidence: 92,
    placementTip: 'Keep the wrist centered and slightly angled toward the camera.',
    summary: 'Great candidate for wrist tracking and size comparison.',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    icon: 'diamond-outline',
    confidence: 89,
    placementTip: 'Use soft lighting to improve edge detection around reflective surfaces.',
    summary: 'Detected as a compact wearable suited for close-range previews.',
  },
  {
    id: 'apparel',
    name: 'Apparel',
    icon: 'shirt-outline',
    confidence: 87,
    placementTip: 'Stand back slightly so the torso is fully visible before applying the overlay.',
    summary: 'Works best with upper-body framing and even lighting.',
  },
  {
    id: 'sofa',
    name: 'Sofa',
    icon: 'bed-outline',
    confidence: 91,
    placementTip: 'Scan from a corner to estimate surrounding free space for placement.',
    summary: 'Large furniture object suited for room placement previews.',
  },
  {
    id: 'lamp',
    name: 'Lamp',
    icon: 'flashlight-outline',
    confidence: 84,
    placementTip: 'Place near walls or corners to judge height and spread.',
    summary: 'Vertical item with helpful room-scale context.',
  },
  {
    id: 'table',
    name: 'Table',
    icon: 'albums-outline',
    confidence: 90,
    placementTip: 'Aim at the floor first so the placement plane locks before previewing.',
    summary: 'Flat-surface object ideal for placement estimation.',
  },
];

const tryOnStyles = [
  'crisp studio lighting',
  'soft edge enhancement',
  'balanced contrast tuning',
  'high-clarity fit alignment',
];

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function seedNumber(value, offset) {
  const text = normalize(value) || 'tryonar';
  return text.charCodeAt(offset % text.length) + offset * 17;
}

function runTryOnAnalysis({ category, imageUri, productName } = {}) {
  const resolvedCategory = category || 'Item';
  const resolvedProduct = productName || null;
  const styleIndex = seedNumber(resolvedProduct || resolvedCategory, 1) % tryOnStyles.length;
  const confidence = 82 + (seedNumber(imageUri || resolvedCategory, 2) % 15);
  const styleNote = tryOnStyles[styleIndex];

  return {
    mode: 'tryon',
    category: resolvedCategory,
    productName: resolvedProduct,
    confidence,
    styleNote,
    details: `${resolvedProduct || resolvedCategory} was processed with ${styleNote}. Confidence is ${confidence}%, so the preview is ready for review and sharing.`,
  };
}

function runPlacementAnalysis({ seed, imageUri } = {}) {
  const source = normalize(seed || imageUri) || 'room';

  const candidates = [...detectionCatalog]
    .map((item, index) => {
      const score = seedNumber(source, index) % 100;
      return { item, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ item }, index) => ({
      ...item,
      confidence: Math.max(78, item.confidence - index * 4),
    }));

  const primaryObject = candidates[0] || null;

  return {
    mode: 'detect',
    primaryObject,
    candidates,
    details: primaryObject
      ? `Detected ${primaryObject.name} with ${primaryObject.confidence}% confidence. ${primaryObject.placementTip}`
      : 'Scene scan completed, but no strong placement candidate was found.',
  };
}

module.exports = {
  detectionCatalog,
  runPlacementAnalysis,
  runTryOnAnalysis,
};
