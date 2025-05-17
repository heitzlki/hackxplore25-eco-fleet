/**
 * Utility functions for making API calls
 */

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
};

/**
 * Generic API fetch function with error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    cache,
  } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, requestOptions);

  // Check if response is OK
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.error || 
      errorData.message || 
      `API error: ${response.status} ${response.statusText}`
    );
    throw Object.assign(error, { status: response.status, data: errorData });
  }

  // Parse response
  return await response.json();
}

/**
 * User API functions
 */
export const UserApi = {
  getAll: () => apiFetch<any[]>('/api/users'),

  getById: (id: string) => apiFetch<any>(`/api/users/${id}`),

  create: (userData: { name: string; email: string; role?: string }) =>
    apiFetch<any>('/api/users', { method: 'POST', body: userData }),

  update: (id: string, userData: Partial<{ name: string; email: string; role: string }>) =>
    apiFetch<any>(`/api/users/${id}`, { method: 'PUT', body: userData }),

  delete: (id: string) =>
    apiFetch<any>(`/api/users/${id}`, { method: 'DELETE' }),
};

import { GarbageContainer } from './store';

/**
 * Container API functions
 */
export const ContainerApi = {
  /**
   * Fetches all container data from Firebase through our API
   */
  getAll: () => apiFetch<GarbageContainer[]>('/api/firebase/containers'),

  /**
   * Fetches a specific container by ID
   */
  getById: (id: string) => apiFetch<GarbageContainer>(`/api/firebase/containers?id=${id}`),

  /**
   * Fetches a limited number of containers
   */
  getLimited: (limit: number) => apiFetch<GarbageContainer[]>(`/api/firebase/containers?limit=${limit}`),
};
