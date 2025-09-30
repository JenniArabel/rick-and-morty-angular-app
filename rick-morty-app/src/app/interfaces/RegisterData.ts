// Interface para datos de registro de usuario
export interface RegisterData {
  fullName: string;  // REQUERIDO
  email: string;     // REQUERIDO
  password: string;  // REQUERIDO
  address?: string;  // OPCIONAL
  city?: string;     // OPCIONAL
  state?: string;    // OPCIONAL
  zip?: string;      // OPCIONAL
  phone?: string;    // OPCIONAL
  birthday?: string; // OPCIONAL
}
