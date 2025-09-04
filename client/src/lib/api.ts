// API utility functions for making requests to the backend

const getApiUrl = (endpoint: string): string => {
  const baseUrl = (import.meta as any).env.VITE_API_URL || '';
  if (baseUrl) {
    // Remove trailing slash from base URL and leading slash from endpoint
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }
  // Fallback to relative path for development
  return `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  return fetch(url, {
    ...defaultOptions,
    ...options,
  });
};

export const apiPost = async (
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<Response> => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiGet = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return apiCall(endpoint, {
    method: 'GET',
    ...options,
  });
};
