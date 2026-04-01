import Constants from 'expo-constants';
import { Platform } from 'react-native';

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

  const hostUri =
    Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost || manifestHostUri;

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

export const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || defaultBackendUrl;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

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

async function authorizedRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
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
  price: number;
  category: string | null;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthSessionResponse = {
  token: string;
  user: AuthUser;
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

export function buildViewerUrl(
  params: Record<string, string | number | null | undefined> = {}
) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${backendUrl}/ai-viewer/${query ? `?${query}` : ''}`;
}

export function formatPrice(value: number) {
  return `Rs. ${value.toFixed(0)}`;
}

export async function fetchProducts(query = '') {
  const path = query.trim()
    ? `/api/products?q=${encodeURIComponent(query.trim())}`
    : '/api/products';

  return request<CatalogProduct[]>(path);
}

export async function fetchProduct(productId: number | string) {
  return request<CatalogProduct>(`/api/products/${productId}`);
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

export async function loginUser(payload: { email: string; password: string }) {
  return request<AuthSessionResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signUpUser(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  return request<AuthSessionResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(token: string) {
  return authorizedRequest<{ success: true }>('/api/auth/logout', token, {
    method: 'POST',
  });
}

export async function fetchCurrentUser(token: string) {
  return authorizedRequest<AuthUser>('/api/me', token);
}

export async function updateCurrentUser(
  token: string,
  payload: Partial<Pick<AuthUser, 'name' | 'email' | 'role'>>
) {
  return authorizedRequest<AuthUser>('/api/me', token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchWorkspaceOverview(token: string) {
  return authorizedRequest<WorkspaceOverview>('/api/workspace/overview', token);
}
