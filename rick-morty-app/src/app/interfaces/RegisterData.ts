// Interface para datos de registro de usuario
export interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface RegisterData {
  name: string;
  mail: string;
  password: string;
  address?: Address;
  phone?: string;
  birthday?: string;
}
