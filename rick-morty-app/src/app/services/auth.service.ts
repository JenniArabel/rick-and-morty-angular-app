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

  private readonly USE_MOCK = true;
  loginWithCredentials(
    mail: string,
    password: string
  ): Observable<AuthResponse> {
    if (this.USE_MOCK) {
      return this.mockAuthService.mockLogin(mail, password);
    }

    const loginData = { mail, password };
    return this.http.post<any>(this.API_LOGIN_URL, loginData).pipe(
      map((response) => {
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

  registerUser(registerData: RegisterData): Observable<any> {
    if (this.USE_MOCK) {
      return this.mockAuthService.mockRegister(registerData);
    }

    return this.http.post<any>(this.API_REGISTER_URL, registerData);
  }
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
