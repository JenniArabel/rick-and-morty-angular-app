import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * LoginGuard - Evita que usuarios ya autenticados accedan a páginas de login/register
 * Si el usuario ya está logueado, lo redirige a la página de characters
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario YA está autenticado, redirigir
  if (authService.isLoggedIn()) {
    router.navigate(['/characters']);
    return false;
  }

  return true; // Usuario NO autenticado puede acceder
};
