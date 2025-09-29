import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm = this.fb.group(
    {
      fullName: [
        '',
        [Validators.required, Validators.pattern(FormUtils.fullNamePattern)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(FormUtils.emailPattern)],
        // [FormUtils.checkingServerResponse],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    },
    {
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
    },
    // TODO: Address
    // TODO: City
    // TODO: State
    // TODO: Zip
  );

  onSubmit() {
    this.myForm.markAllAsTouched();
    console.log(this.myForm.value);
  }
}
