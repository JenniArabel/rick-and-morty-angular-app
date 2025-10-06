import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AuthResponse } from '../interfaces/AuthResponse';
import { RegisterData } from '../interfaces/RegisterData';
import { MockAuthService } from './mock-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';
  private readonly API_LOGIN_URL =
    'https://api-auth-moby.herokuapp.com/api/user/login';
  private readonly API_REGISTER_URL =
    'https://api-auth-moby.herokuapp.com/api/user';
  private http = inject(HttpClient);
  private mockAuthService = inject(MockAuthService);

  // 🚨 MODO MOCK - Cambiar a false cuando la API esté funcionando
  private readonly USE_MOCK = true;

  // Método principal para login con credenciales
  loginWithCredentials(
    mail: string,
    password: string
  ): Observable<AuthResponse> {
    // 🚨 Si la API está en mantenimiento, usar mock
    if (this.USE_MOCK) {
      return this.mockAuthService.mockLogin(mail, password);
    }

    // Llamada real a la API
    const loginData = { mail, password };
    return this.http.post<any>(this.API_LOGIN_URL, loginData).pipe(
      map((response) => {
        // Adaptar la respuesta de la API al formato AuthResponse
        let address = undefined;
        if (response.user?.address) {
          address = {
            street: response.user.address.street || '',
            location: response.user.address.location || '',
            city: response.user.address.city || '',
            country: response.user.address.country || '',
            cp: response.user.address.cp || '',
          };
        }

        const authResponse: AuthResponse = {
          token: response.token || response.accessToken || response.jwt,
          user: {
            mail: mail,
            name: response.user?.name || mail.split('@')[0],
            address: address,
            phone: response.user?.phone,
            birthday: response.user?.birthday,
          },
        };
        return authResponse;
      })
    );
  }

  // Método para registrar un nuevo usuario
  registerUser(registerData: RegisterData): Observable<any> {
    // 🚨 Si la API está en mantenimiento, usar mock
    if (this.USE_MOCK) {
      return this.mockAuthService.mockRegister(registerData);
    }

    // Llamada real a la API de registro
    return this.http.post<any>(this.API_REGISTER_URL, registerData);
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
