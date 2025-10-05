// Interface para usuario autenticado
export interface User {
  mail: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
}
