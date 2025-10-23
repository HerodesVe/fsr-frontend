import { useQuery } from '@tanstack/react-query';

import { getAllClients } from '@/services/clients.service';

export const useClients = () => {
  const {
    data: clients,
    isLoading,
    error,
    refetch,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('🔄 useClients: Iniciando petición GET /clients/');
      try {
        const result = await getAllClients();
        console.log('✅ useClients: Petición exitosa', result);
        return result;
      } catch (err) {
        console.error('❌ useClients: Error en petición', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    enabled: true, // Asegurar que la query está habilitada
  });

  // Log del estado actual
  console.log('📊 useClients Estado:', {
    status,
    fetchStatus,
    isLoading,
    hasData: !!clients,
    dataLength: clients?.length,
    error: error?.message,
  });

  return { 
    clients, 
    isLoading, 
    error, 
    refetch 
  };
};


