import api from './api';
import type { UserOut } from '@/types/user.types';

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  dni: string;
  worker_code: number;
  role: 'OPERATOR' | 'ADMIN' | 'SUPERVISOR';
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

export const getAllUsers = async (): Promise<UserOut[]> => {
  const response = await api.get('/users/');
  return response.data;
};

export const createUser = async (userData: CreateUserData): Promise<UserOut> => {
  const response = await api.post('/users/', userData);
  return response.data;
};

export const updateUser = async (userData: UpdateUserData): Promise<UserOut> => {
  const { id, ...data } = userData;
  const response = await api.put(`/users/${id}/`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}/`);
};

export const getUserById = async (id: number): Promise<UserOut> => {
  const response = await api.get(`/users/${id}/`);
  return response.data;
};