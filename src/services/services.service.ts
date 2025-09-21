import api from './api';
import type { ServiceDefinition, UpdateServiceRequest } from '@/types/service.types';

export const getAllServiceDefinitions = async (): Promise<ServiceDefinition[]> => {
  const response = await api.get('/service-definitions/');
  return response.data;
};

export const updateServiceDefinition = async (id: string, data: UpdateServiceRequest): Promise<ServiceDefinition> => {
  const response = await api.put(`/service-definitions/${id}/`, data);
  return response.data;
};

export const getServiceDefinitionById = async (id: string): Promise<ServiceDefinition> => {
  const response = await api.get(`/service-definitions/${id}/`);
  return response.data;
};


