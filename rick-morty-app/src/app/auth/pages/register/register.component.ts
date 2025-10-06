import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { AuthService } from '../../../services/auth.service';
import { RegisterData, Address } from '../../../interfaces/RegisterData';
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
      name: [
        '',
        [Validators.required, FormUtils.nameValidator], // min 5, max 15 caracteres
      ],
      mail: ['', [Validators.required, FormUtils.mailValidator]], // min 10, max 50 caracteres
      password: [
        '',
        [Validators.required, FormUtils.passwordValidatorWithLength],
      ], // min 8, max 30 caracteres
      password2: ['', Validators.required],
      address: [''], // Dirección física (calle, número, depto)
      city: [''],
      state: [''],
      zip: [''],
    },
    {
      validators: [
        FormUtils.isFieldOneEqualFieldTwo('password', 'password2'),
        FormUtils.addressGroupValidator,
      ],
    }
  );

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.registerError = '';
      this.registerSuccess = false;

      const formData = this.myForm.value;

      // Crear objeto de dirección solo si se proporcionan todos los campos
      let address: Address | undefined = undefined;
      if (formData.address && formData.city && formData.state && formData.zip) {
        address = {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        };
      }

      const registerData: RegisterData = {
        name: formData.name || '',
        mail: formData.mail || '',
        password: formData.password || '',
        address: address,
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
