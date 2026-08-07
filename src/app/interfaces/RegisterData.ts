// Interface para datos de registro de usuario
export interface Address {
  street: string; // Dirección física (ej: "Av. 9 de julio 1925")
  location?: string; // Opcional (ej: "-")
  city: string; // Ciudad (ej: "CABA")
  country: string; // País (ej: "Argentina")
  cp: string; // Código postal (ej: "1072")
}

export interface RegisterData {
  name: string;
  mail: string;
  password: string;
  address?: Address;
  phone?: string;
  birthday?: string;
}
