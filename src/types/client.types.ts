export enum ClientType {
  NATURAL = 'natural',
  JURIDICAL = 'juridical',
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DocType {
  DNI = 'DNI',
  CE = 'CE',
  PASSPORT = 'PASSPORT',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export interface Spouse {
  paternalSurname: string;
  maternalSurname: string;
  names: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
}

export interface Address {
  urbanization: string;
  mz: string | null;
  lote: string | null;
  subLote: string | null;
  street: string;
  number: string;
  interior: string;
  department: {
    id: string;
    name: string;
  };
  province: {
    id: string;
    name: string;
    departmentId: string;
  };
  district: {
    id: string;
    name: string;
    provinceId: string;
    departmentId: string;
  };
}

export interface Client {
  id: string;
  clientType: ClientType;
  docType?: string;
  docNumber?: string;
  maritalStatus?: string;
  names?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  phone?: string;
  email?: string;
  spouse?: Spouse;
  // Para persona jurídica
  ruc?: string;
  businessName?: string;
  status: ClientStatus;
  address: Address;
}

// Este es el tipo que la API devuelve
export interface ClientOut extends Client {}

// Tipos para el formulario (estructura que enviamos al backend)
export interface CreateClientRequest {
  clientType: 'natural' | 'juridical';
  // Campos para persona natural
  docType?: string;
  docNumber?: string;
  maritalStatus?: string;
  names?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  phone?: string;
  email?: string;
  spouse?: {
    paternalSurname: string;
    maternalSurname: string;
    names: string;
    docType: string;
    docNumber: string;
    phone: string;
    email: string;
  };
  // Campos para persona jurídica
  ruc?: string;
  businessName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  address: {
    urbanization: string;
    mz?: string;
    lote?: string;
    subLote?: string;
    street: string;
    number: string;
    interior: string;
    departmentId: string;
    provinceId: string;
    districtId: string;
  };
}

export interface UpdateClientRequest extends CreateClientRequest {
  id: string;
}
