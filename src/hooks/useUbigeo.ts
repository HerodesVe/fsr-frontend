import { useQuery } from '@tanstack/react-query';

import { getDepartments, getProvincesByDepartment, getDistrictsByProvince } from '@/services/ubigeo.service';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
  });
};

export const useProvinces = (departmentId: string) => {
  return useQuery({
    queryKey: ['provinces', departmentId],
    queryFn: () => getProvincesByDepartment(departmentId),
    enabled: !!departmentId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

export const useDistricts = (provinceId: string) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () => getDistrictsByProvince(provinceId),
    enabled: !!provinceId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};


