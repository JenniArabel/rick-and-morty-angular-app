import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { AuthService } from '../../../services/auth.service';
import { RegisterData } from '../../../interfaces/RegisterData';
import { AuthErrorHandlerService } from '../../services/auth-error-handler.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authErrorHandler = inject(AuthErrorHandlerService);

  formUtils = FormUtils;
  isLoading = false;
  registerError = '';
  registerSuccess = false;

  myForm = this.fb.group(
    {
      fullName: [
        '',
        [Validators.required, Validators.pattern(FormUtils.fullNamePattern)],
      ],
      email: ['', [Validators.required, FormUtils.emailValidator]], // Mismo email
      password: ['', [Validators.required, FormUtils.passwordValidator]], // Contraseña compleja
      password2: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
    },
    {
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
    }
  );

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.registerError = '';
      this.registerSuccess = false;

      const formData = this.myForm.value;
      const registerData: RegisterData = {
        fullName: formData.fullName || '',
        email: formData.email || '',
        password: formData.password || '',
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zip: formData.zip || undefined,
      };

      this.authService.registerUser(registerData).subscribe({
        next: (response) => {
          this.registerSuccess = true;
          this.isLoading = false;

          // Mostrar mensaje de éxito y redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          // Usar el servicio centralizado para manejar errores de registro
          this.registerError = this.authErrorHandler.handleRegisterError(error);
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
