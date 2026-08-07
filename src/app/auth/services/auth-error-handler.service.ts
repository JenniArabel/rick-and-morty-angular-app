import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService {

  // Mensajes de error comunes
  private readonly ERROR_MESSAGES = {
    NETWORK_ERROR: 'No se puede conectar con el servidor. Verifica tu conexión a internet.',
    UNAUTHORIZED: 'Credenciales incorrectas. Verifica tu email y contraseña.',
    EMAIL_EXISTS: 'El email ya está registrado. Intenta con otro email.',
    LOGIN_DEFAULT: 'Error al iniciar sesión. Inténtalo nuevamente.',
    REGISTER_DEFAULT: 'Error al registrar usuario. Inténtalo nuevamente.',
    LOGIN_BAD_REQUEST: 'Datos de login inválidos.',
    REGISTER_BAD_REQUEST: 'Datos de registro inválidos.'
  };

  /**
   * Maneja errores de login y devuelve un mensaje apropiado
   */
  handleLoginError(error: any): string {
    switch (error.status) {
      case 401:
        return this.ERROR_MESSAGES.UNAUTHORIZED;
      
      case 400:
        return error.error?.message || this.ERROR_MESSAGES.LOGIN_BAD_REQUEST;
      
      case 0:
        return this.ERROR_MESSAGES.NETWORK_ERROR;
      
      default:
        return error.error?.message || 
               error.message || 
               this.ERROR_MESSAGES.LOGIN_DEFAULT;
    }
  }

  /**
   * Maneja errores de registro y devuelve un mensaje apropiado
   */
  handleRegisterError(error: any): string {
    switch (error.status) {
      case 400:
        return error.error?.message || this.ERROR_MESSAGES.REGISTER_BAD_REQUEST;
      
      case 409:
        return this.ERROR_MESSAGES.EMAIL_EXISTS;
      
      case 0:
        return this.ERROR_MESSAGES.NETWORK_ERROR;
      
      default:
        return error.message || this.ERROR_MESSAGES.REGISTER_DEFAULT;
    }
  }

  /**
   * Determina si un error requiere reintento automático
   */
  shouldRetry(error: any): boolean {
    // Errores de red (status 0) o errores temporales del servidor
    return error.status === 0 || error.status >= 500;
  }

  /**
   * Determina si es un error crítico que requiere atención inmediata
   */
  isCriticalError(error: any): boolean {
    return error.status >= 500;
  }
}