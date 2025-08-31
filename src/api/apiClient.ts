import { Api } from './api';

export const apiClient = new Api({
  baseUrl:
    import.meta.env.VITE_API_BASE_URL || 'https://mvp-dashboard.onrender.com',
  baseApiParams: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
});
