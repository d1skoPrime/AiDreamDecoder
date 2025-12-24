import { useAuthStore } from '../Store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  });
  
  // Add auth token if required
  if (requiresAuth) {
    const { accessToken, refreshToken } = useAuthStore.getState();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }
  
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: 'include',
    headers,
  });

  // If 401 (Unauthorized), try to refresh token
  if (response.status === 401 && requiresAuth) {
    try {
      await useAuthStore.getState().refreshToken();
      
      // Retry original request with new token
      const newToken = useAuthStore.getState().accessToken;
      headers.set('Authorization', `Bearer ${newToken}`);
      
      response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: 'include',
        headers,
      });
    } catch (error) {
      // Refresh failed - redirect to login
      useAuthStore.getState().logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}