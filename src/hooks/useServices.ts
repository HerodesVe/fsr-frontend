import { useQuery } from '@tanstack/react-query';

import { getAllServiceDefinitions } from '@/services/services.service';

export const useServices = () => {
  const {
    data: services,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['service-definitions'],
    queryFn: getAllServiceDefinitions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  return { 
    services, 
    isLoading, 
    error, 
    refetch 
  };
};


