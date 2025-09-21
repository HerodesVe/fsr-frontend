import api from './api';

import type { TokenResponse } from '@/types/auth.types';

export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const params = new URLSearchParams();

  params.append('username', email);
  params.append('password', password);

  const response = await api.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};