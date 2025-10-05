// Interface para datos de registro de usuario
export interface RegisterData {
  name: string;
  mail: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  birthday?: string;
}
