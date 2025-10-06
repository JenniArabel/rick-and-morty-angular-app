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
import { AuthErrorHandlerService } from '../../services/auth-error-handler.service';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authErrorHandler = inject(AuthErrorHandlerService);

  formUtils = FormUtils;
  isLoading = false;
  loginError = '';

  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, FormUtils.mailValidator]],
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
          // Usar el servicio centralizado para manejar errores de login
          this.loginError = this.authErrorHandler.handleLoginError(error);
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
