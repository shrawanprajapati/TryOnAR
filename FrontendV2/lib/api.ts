import Constants from 'expo-constants';
import { Linking, Platform } from 'react-native';

import type { DetectedObject } from '../constants/objectDetection';

function resolveExpoHostUrl() {
  const manifestHostUri =
    (
      Constants.manifest2 as
        | {
            extra?: {
              expoClient?: {
                hostUri?: string;
              };
            };
          }
        | null
    )?.extra?.expoClient?.hostUri || null;

  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost || manifestHostUri;

  if (!hostUri) {
    return null;
  }

  const [host] = hostUri.split(':');

  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  return `http://${host}:4000`;
}

function resolveWebHostUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return null;
  }

  const protocol = window.location.protocol || 'http:';
  const hostname = window.location.hostname || 'localhost';

  return `${protocol}//${hostname}:4000`;
}

const defaultBackendUrl =
  resolveExpoHostUrl() ||
  resolveWebHostUrl() ||
  Platform.select({
    android: 'http://10.0.2.2:4000',
    ios: 'http://localhost:4000',
    default: 'http://localhost:4000',
  }) ||
  'http://localhost:4000';

const envBackendUrl =
  Platform.OS === 'web' ? process.env.EXPO_PUBLIC_BACKEND_URL_WEB : process.env.EXPO_PUBLIC_BACKEND_URL;

export const backendUrl = envBackendUrl || defaultBackendUrl;
export const aiViewerUrl =
  process.env.EXPO_PUBLIC_AI_VIEWER_URL || 'https://virtual-hat-glasses-try-on-booth.vercel.app';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${backendUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    const accessHint =
      Platform.OS === 'android'
        ? 'Make sure the backend server is running and the emulator can access it.'
        : 'Make sure the backend server is running and reload the page after it starts.';
    throw new Error(`Unable to reach the backend at ${backendUrl}. ${accessHint}`);
  }

  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string' &&
        data.message) ||
        (typeof data === 'string' && data) ||
        'Request failed.'
    );
  }

  return data as T;
}

async function authorizedRequest<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export type CatalogProduct = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  modelSlug: string | null;
  price: number | string;
  category: string | null;
};

export type WorkspaceOverview = {
  models: Array<{
    id: number;
    title: string;
    category: string | null;
    imageUrl: string;
    modelSlug: string | null;
  }>;
  snapshots: Array<{
    id: string;
    title: string;
    subtitle: string;
  }>;
};

export type TryOnResponse = {
  mode: 'tryon';
  category: string;
  productName: string | null;
  confidence: number;
  styleNote: string;
  details: string;
  viewerUrl: string;
};

export type PlacementResponse = {
  mode: 'detect';
  primaryObject: DetectedObject | null;
  candidates: DetectedObject[];
  details: string;
  viewerUrl: string;
};

export function buildViewerUrl(params: Record<string, string | number | null | undefined> = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${aiViewerUrl}${query ? `?${query}` : ''}`;
}

export async function openViewerUrl(url: string) {
  if (!url) {
    throw new Error('Viewer URL is missing.');
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (!openedWindow) {
      window.location.assign(url);
    }

    return;
  }

  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error(`Viewer URL could not be opened: ${url}`);
  }

  await Linking.openURL(url);
}

export function resolveHostedBoothCategory(...values: Array<string | null | undefined>) {
  const combinedValue = values
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ')
    .toLowerCase();

  if (/(eyewear|glasses|spectacles|aviator|frames|sunglasses|shades)/i.test(combinedValue)) {
    return 'glasses';
  }

  if (/(hat|hats|cap|caps|beanie|helmet)/i.test(combinedValue)) {
    return 'hats';
  }

  return null;
}

export function formatPrice(value: number | string) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return 'Rs. 0';
  }

  return `Rs. ${numericValue.toFixed(0)}`;
}

export async function fetchProducts(query = '') {
  const path = query.trim() ? `/api/products?q=${encodeURIComponent(query.trim())}` : '/api/products';
  return request<CatalogProduct[]>(path);
}

export async function fetchProduct(productId: number | string) {
  return request<CatalogProduct>(`/api/products/${productId}`);
}

export async function syncUser(token: string, email?: string | null) {
  return authorizedRequest<{ message: string; user: unknown }>('/api/users/sync', token, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function fetchProfile(token: string) {
  return authorizedRequest<{
    uid: string;
    email: string | null;
    name: string | null;
    databaseUser: { id: number; firebaseUid: string; email: string; name: string | null } | null;
  }>('/api/users/me', token);
}

export async function fetchWorkspaceOverview(token: string) {
  return authorizedRequest<WorkspaceOverview>('/api/workspace/overview', token);
}

export async function runTryOnAnalysis(payload: {
  imageUri: string;
  category: string;
  productName?: string;
}) {
  return request<TryOnResponse>('/api/ai/tryon', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function runPlacementScan(payload: {
  seed: string;
  imageUri: string;
  productName?: string;
  category?: string;
}) {
  return request<PlacementResponse>('/api/ai/detect', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
