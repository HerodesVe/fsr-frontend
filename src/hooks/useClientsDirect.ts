import { useState, useEffect } from 'react';
import { getAllClients } from '@/services/clients.service';
import type { ClientOut } from '@/types/client.types';

// Hook alternativo sin React Query para debugging
export const useClientsDirect = () => {
  const [clients, setClients] = useState<ClientOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      console.log('🔄 useClientsDirect: Iniciando petición');
      setIsLoading(true);
      setError(null);
      
      const data = await getAllClients();
      
      console.log('✅ useClientsDirect: Datos recibidos', data);
      setClients(data);
    } catch (err) {
      console.error('❌ useClientsDirect: Error', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
  };
};



