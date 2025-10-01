import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  formUtils = FormUtils;
  isLoading = false;
  loginError = '';

  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, FormUtils.emailValidator]],
    password: ['', [Validators.required, FormUtils.minLengthValidator(6)]],
  });

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const { email, password } = this.myForm.value;

      this.authService.loginWithCredentials(email, password).subscribe({
        next: (authResponse) => {
          // Guardar datos de autenticación
          this.authService.saveAuthData(authResponse);

          // Redirigir al listado de personajes
          this.router.navigate(['/characters']);
        },
        error: (error) => {
          this.isLoading = false;

          // Manejar diferentes tipos de errores de la API
          if (error.status === 401) {
            this.loginError =
              'Credenciales incorrectas. Verifica tu email y contraseña.';
          } else if (error.status === 400) {
            this.loginError =
              error.error?.message || 'Datos de login inválidos.';
          } else if (error.status === 0) {
            this.loginError =
              'No se puede conectar con el servidor. Verifica tu conexión a internet.';
          } else {
            this.loginError =
              error.error?.message ||
              error.message ||
              'Error al iniciar sesión. Inténtalo nuevamente.';
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
