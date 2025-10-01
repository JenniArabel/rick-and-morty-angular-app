import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { AuthService } from '../../../services/auth.service';
import { RegisterData } from '../../../interfaces/RegisterData';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

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

          // Manejar diferentes tipos de errores
          if (error.status === 400) {
            this.registerError =
              error.error?.message || 'Datos de registro inválidos.';
          } else if (error.status === 409) {
            this.registerError =
              'El email ya está registrado. Intenta con otro email.';
          } else if (error.status === 0) {
            this.registerError =
              'No se puede conectar con el servidor. Verifica tu conexión a internet.';
          } else {
            this.registerError =
              error.message ||
              'Error al registrar usuario. Inténtalo nuevamente.';
          }
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
