import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AuthResponse } from '../interfaces/AuthResponse';
import { RegisterData } from '../interfaces/RegisterData';
import { MockUser } from '../interfaces/MockUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';
  private readonly API_LOGIN_URL = 'https://api-auth-moby.herokuapp.com/api/user/login';
  private readonly API_REGISTER_URL = 'https://api-auth-moby.herokuapp.com/api/user'; // Mismo endpoint para registro
  private http = inject(HttpClient);

  // 🚨 MODO MOCK - Cambiar a false cuando la API esté funcionando
  private readonly USE_MOCK = true;

  // Mock de usuarios para cuando la API esté en mantenimiento
  private mockUsers: MockUser[] = [
    {
      email: 'admin@test.com',
      password: '123456',
      name: 'Administrador',
      address: '123 Admin St',
      city: 'Admin City',
      state: 'AC',
      zip: '12345'
    },
    {
      email: 'user@test.com',
      password: '123456',
      name: 'Usuario Test',
      phone: '+1234567890'
    },
    {
      email: 'demo@demo.com',
      password: 'demo123',
      name: 'Demo User'
    },
  ];

  // Método principal para login con credenciales
  loginWithCredentials(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    // 🚨 Si la API está en mantenimiento, usar mock
    if (this.USE_MOCK) {
      return this.mockLogin(email, password);
    }

    // Llamada real a la API
    const loginData = { email, password };
    return this.http.post<any>(this.API_LOGIN_URL, loginData).pipe(
      map((response) => {
        // Adaptar la respuesta de la API al formato AuthResponse
        const authResponse: AuthResponse = {
          token: response.token || response.accessToken || response.jwt,
          user: {
            email: email,
            name: response.user?.name || email.split('@')[0],
            address: response.user?.address,
            city: response.user?.city,
            state: response.user?.state,
            zip: response.user?.zip,
            phone: response.user?.phone,
            birthday: response.user?.birthday,
          },
        };
        return authResponse;
      })
    );
  }

  // 🎭 Mock de login para cuando la API esté en mantenimiento
  private mockLogin(email: string, password: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        // Buscar usuario en el mock
        const user = this.mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const authResponse: AuthResponse = {
            token: `mock-token-${Date.now()}`,
            user: {
              email: email,
              name: user.name,
              address: user.address,
              city: user.city,
              state: user.state,
              zip: user.zip,
              phone: user.phone,
            },
          };
          return authResponse;
        } else {
          throw new Error('Credenciales incorrectas');
        }
      })
    );
  }

  // Método para registrar un nuevo usuario
  registerUser(registerData: RegisterData): Observable<any> {

    // 🚨 Si la API está en mantenimiento, usar mock
    if (this.USE_MOCK) {
      return this.mockRegister(registerData);
    }

    // Llamada real a la API de registro
    return this.http.post<any>(this.API_REGISTER_URL, registerData);
  }

  // 🎭 Mock de registro para cuando la API esté en mantenimiento
  private mockRegister(registerData: RegisterData): Observable<any> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        // Verificar si el email ya existe
        const existingUser = this.mockUsers.find(u => u.email === registerData.email);

        if (existingUser) {
          throw new Error('El email ya está registrado');
        }

        // Agregar usuario al mock
        const newUser = {
          email: registerData.email,
          password: registerData.password,
          name: registerData.fullName,
          address: registerData.address,
          city: registerData.city,
          state: registerData.state,
          zip: registerData.zip,
          phone: registerData.phone,
          birthday: registerData.birthday,
        };
        this.mockUsers.push(newUser);

        // Respuesta exitosa del registro
        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          user: {
            email: registerData.email,
            fullName: registerData.fullName
          }
        };
      })
    );
  }

  // Guardar datos de autenticación en el Local Storage
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  // Verificar si el usuario está autenticado, se usa en el guard
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Metodo para obtener el usuario actual, se puede usar en el header para mostrar el nombre o un mensaje de bienvenida {name} personalizado
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY); // Obtiene string del localStorage
    return userStr ? JSON.parse(userStr) : null; // Lo convierte a objeto User o null
  }

  // Metodo para obtener el token, se puede usar en servicios que requieran el token en los headers
  // tambien se puede usar en interceptores HTTP o para validar el token antes de hacer llamadas a la API
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
