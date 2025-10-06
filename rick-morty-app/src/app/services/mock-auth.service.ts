import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/AuthResponse';
import { RegisterData } from '../interfaces/RegisterData';
import { MockUser } from '../interfaces/MockUser';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  // Mock de usuarios para cuando la API esté en mantenimiento
  private mockUsers: MockUser[] = [
    {
      mail: 'admin@test.com',
      password: '123456',
      name: 'Administrador',
      address: {
        address: 'Av. Córdoba 1234',
        city: 'Admin City',
        state: 'AC',
        zip: '12345',
      },
    },
    {
      mail: 'user@test.com',
      password: '123456',
      name: 'Usuario Test',
      phone: '+1234567890',
    },
    {
      mail: 'demo@demo.com',
      password: 'demo123',
      name: 'Demo User',
    },
  ];

  // Mock de login para cuando la API esté en mantenimiento
  mockLogin(mail: string, password: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        // Buscar usuario en el mock
        const user = this.mockUsers.find(
          (u) => u.mail === mail && u.password === password
        );

        if (user) {
          const authResponse: AuthResponse = {
            token: `mock-token-${Date.now()}`,
            user: {
              mail: mail,
              name: user.name,
              address: user.address,
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
        // Verificar si el mail ya existe
        const existingUser = this.mockUsers.find(
          (u) => u.mail === registerData.mail
        );

        if (existingUser) {
          throw new Error('El mail ya está registrado');
        }

        // Agregar usuario al mock
        const newUser: MockUser = {
          mail: registerData.mail,
          password: registerData.password,
          name: registerData.name,
          address: registerData.address,
          phone: registerData.phone,
          birthday: registerData.birthday,
        };
        this.mockUsers.push(newUser);

        // Respuesta exitosa del registro
        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          user: {
            mail: registerData.mail,
            name: registerData.name,
          },
        };
      })
    );
  }

  //Agregar usuario mock (para testing)
  addMockUser(user: MockUser): void {
    this.mockUsers.push(user);
  }
}
