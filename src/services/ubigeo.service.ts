import api from './api';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Province {
  id: string;
  name: string;
  code: string;
  department_id: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  province_id: string;
}

// Obtener todos los departamentos
export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get('ubigeo/departments');
  return response.data;
};

// Obtener provincias por departamento
export const getProvincesByDepartment = async (departmentId: string): Promise<Province[]> => {
  const response = await api.get(`ubigeo/departments/${departmentId}/provinces`);
  return response.data;
};

// Obtener distritos por provincia
export const getDistrictsByProvince = async (provinceId: string): Promise<District[]> => {
  const response = await api.get(`ubigeo/provinces/${provinceId}/districts`);
  return response.data;
};
