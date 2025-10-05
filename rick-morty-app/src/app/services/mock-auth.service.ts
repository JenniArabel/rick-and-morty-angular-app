import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/AuthResponse';
import { RegisterData } from '../interfaces/RegisterData';
import { MockUser } from '../interfaces/MockUser';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {

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

  // Mock de login para cuando la API esté en mantenimiento
  mockLogin(email: string, password: string): Observable<AuthResponse> {
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

  // Mock de registro para cuando la API esté en mantenimiento
  mockRegister(registerData: RegisterData): Observable<any> {
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

  //Agregar usuario mock (para testing)
  addMockUser(user: MockUser): void {
    this.mockUsers.push(user);
  }
}
