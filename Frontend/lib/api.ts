import { Platform } from 'react-native';

const defaultBackendUrl = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || defaultBackendUrl;
const aiViewerUrl = `${backendUrl}/ai-viewer/`;

async function request(path: string, options: RequestInit = {}, token?: string) {
  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  modelSlug: string | null;
  price: number;
  category: string | null;
};

export async function fetchProducts() {
  return request('/api/products') as Promise<Product[]>;
}

export async function fetchProduct(productId: number | string) {
  return request(`/api/products/${productId}`) as Promise<Product>;
}

export async function syncUser(token: string, email?: string | null) {
  return request(
    '/api/users/sync',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
    token
  );
}

export async function fetchProfile(token: string) {
  return request('/api/users/me', {}, token) as Promise<{
    uid: string;
    email: string | null;
    name: string | null;
    databaseUser: { id: number; firebaseUid: string; email: string; name: string | null } | null;
  }>;
}

export { aiViewerUrl, backendUrl };
