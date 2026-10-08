const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

const getToken = () => localStorage.getItem('token');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'API error');
  return json.data;
}

// Auth
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password })
      }),
    me: () => request<any>('/auth/me'),
    register: (email: string, password: string, name: string) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST', body: JSON.stringify({ email, password, name })
      }),
  },

  offers: {
    list: () => request<any[]>('/offers'),
    get: (id: string) => request<any>(`/offers/${id}`),
    create: (data: any) => request<any>('/offers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/offers/${id}`, { method: 'DELETE' }),
  },

  pricelist: {
    list: () => request<any[]>('/pricelist'),
    updateLom: (id: string, data: any) => request<any>(`/pricelist/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  settings: {
    get: () => request<any>('/settings'),
    update: (data: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },

  stats: {
    get: () => request<any>('/stats'),
  },
};
