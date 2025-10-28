export enum UserRole {
    ADMINISTRATOR = 'ADMINISTRATOR',
    OPERATOR = 'OPERATOR',
  }
  
  export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
  }
  
  export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    dni: string;
    role: UserRole;
    status: UserStatus;
  }
  
  // Este es el tipo que la API devuelve (sin contraseña)
  export interface UserOut extends User {}