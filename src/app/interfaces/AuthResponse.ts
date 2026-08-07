import type { User } from './User';

// Interface para respuesta de autenticación (login/registro)
export interface AuthResponse {
  token: string;
  user: User;
}
