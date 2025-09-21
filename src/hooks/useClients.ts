import { useQuery } from '@tanstack/react-query';

import { getAllClients } from '@/services/clients.service';

export const useClients = () => {
  const {
    data: clients,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getAllClients,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  return { 
    clients, 
    isLoading, 
    error, 
    refetch 
  };
};


