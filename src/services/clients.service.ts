import api from './api';
import type { ClientOut, CreateClientRequest, UpdateClientRequest } from '@/types/client.types';

export const getAllClients = async (): Promise<ClientOut[]> => {
  const response = await api.get('/clients/');
  const data = response.data;
  if (Array.isArray(data)) return data;
  // Soporte para respuestas paginadas: { results: [...] } o { data: [...] }
  if (data?.results && Array.isArray(data.results)) return data.results;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const createClient = async (clientData: CreateClientRequest): Promise<ClientOut> => {
  const response = await api.post('/clients/', clientData);
  return response.data;
};

export const updateClient = async (clientData: UpdateClientRequest): Promise<ClientOut> => {
  const { id, ...data } = clientData;
  const response = await api.put(`/clients/${id}/`, data);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}/`);
};

export const getClientById = async (id: string): Promise<ClientOut> => {
  const response = await api.get(`/clients/${id}/`);
  return response.data;
};
