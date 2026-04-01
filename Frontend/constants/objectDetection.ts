export type DetectedObject = {
  id: string;
  name: string;
  icon:
    | 'glasses-outline'
    | 'watch-outline'
    | 'diamond-outline'
    | 'shirt-outline'
    | 'bed-outline'
    | 'leaf-outline'
    | 'flashlight-outline'
    | 'albums-outline';
  confidence: number;
  placementTip: string;
  summary: string;
};

const detectionCatalog: DetectedObject[] = [
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
    id: 'plant',
    name: 'Plant',
    icon: 'leaf-outline',
    confidence: 86,
    placementTip: 'Look for flat floor or table surfaces to anchor the model cleanly.',
    summary: 'Small decor item suitable for desk and room staging.',
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

export function detectObjectsFromSeed(seed: string): DetectedObject[] {
  const normalizedSeed = seed.trim().toLowerCase();

  if (!normalizedSeed) {
    return detectionCatalog.slice(0, 3);
  }

  return [...detectionCatalog]
    .map((item, index) => {
      const charCode = normalizedSeed.charCodeAt(index % normalizedSeed.length) ?? 0;
      const score = (charCode + item.name.length * 17 + index * 13) % 100;
      return { item, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ item }, index) => ({
      ...item,
      confidence: Math.max(78, item.confidence - index * 3),
    }));
}
