import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from '@/services/user.service';

export const useUsers = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  return { 
    users, 
    isLoading, 
    error, 
    refetch 
  };
};
