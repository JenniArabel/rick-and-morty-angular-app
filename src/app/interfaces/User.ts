import { Address } from './RegisterData';

// Interface para usuario autenticado
export interface User {
  mail: string;
  name: string;
  address?: Address;
  phone?: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
}
