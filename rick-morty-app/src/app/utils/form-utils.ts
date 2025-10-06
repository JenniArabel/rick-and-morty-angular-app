import {
  FormArray,
  FormGroup,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

export class FormUtils {
  // Expresiones regulares para validación
  static fullNamePattern = '([a-zA-Z]+) ([a-zA-Z]+)'; // Nombre y apellido con espacio en medio, cualquier cantidad de caracteres
  static readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'; // hasta 9 caracteres antes de la @, dominio (despues del .) de hasta 4 letras
  static readonly passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return 'Por favor, ingresa un email válido';

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }
          if (errors['pattern'].requiredPattern === FormUtils.passwordPattern) {
            return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
          }

          return 'El valor ingresado no tiene el formato esperado';

        case 'weakPassword':
          return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';

        case 'invalidEmailFormat':
          return 'El email debe tener un formato válido';

        case 'minLengthCustom':
          return `La contraseña debe tener al menos ${errors['minLengthCustom'].requiredLength} caracteres`;

        case 'passwordsNotEqual':
          return 'Las contraseñas no coinciden';

        case 'nameMinLength':
          return `El nombre debe tener al menos ${errors['nameMinLength'].requiredLength} caracteres`;

        case 'nameMaxLength':
          return `El nombre debe tener máximo ${errors['nameMaxLength'].requiredLength} caracteres`;

        case 'mailMinLength':
          return `El mail debe tener al menos ${errors['mailMinLength'].requiredLength} caracteres`;

        case 'mailMaxLength':
          return `El mail debe tener máximo ${errors['mailMaxLength'].requiredLength} caracteres`;

        case 'passwordMinLength':
          return `La contraseña debe tener al menos ${errors['passwordMinLength'].requiredLength} caracteres`;

        case 'passwordMaxLength':
          return `La contraseña debe tener máximo ${errors['passwordMaxLength'].requiredLength} caracteres`;

        case 'incompleteAddress':
          return 'Si proporciona dirección, debe completar ciudad, estado y código postal';

        case 'invalidType':
          return 'El tipo de dato no es válido';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }
    return null;
  }

  // Método para validar si un campo es valido o no
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  // Validador personalizado para contraseña segura (para registro)
  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex = new RegExp(FormUtils.passwordPattern);
    const isValid = regex.test(value);

    return isValid ? null : { weakPassword: true };
  }

  // Validador de email personalizado (verifica formato básico con punto y extensión)
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex = new RegExp(FormUtils.emailPattern);
    const isValid = regex.test(value);

    return isValid ? null : { invalidEmailFormat: true };
  }

  // Validador simple de longitud mínima para login
  static minLengthValidator(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const isValid = value.length >= minLength;
      return isValid
        ? null
        : {
            minLengthCustom: {
              requiredLength: minLength,
              actualLength: value.length,
            },
          };
    };
  }

  // Validador para nombre (min 5, max 15 caracteres)
  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    if (typeof value !== 'string') {
      return { invalidType: true };
    }

    if (value.length < 5) {
      return {
        nameMinLength: { requiredLength: 5, actualLength: value.length },
      };
    }

    if (value.length > 15) {
      return {
        nameMaxLength: { requiredLength: 15, actualLength: value.length },
      };
    }

    return null;
  }

  // Validador para mail (min 10, max 50 caracteres)
  static mailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    if (typeof value !== 'string') {
      return { invalidType: true };
    }

    // Primero validar el formato de email
    const emailRegex = new RegExp(FormUtils.emailPattern);
    if (!emailRegex.test(value)) {
      return { invalidEmailFormat: true };
    }

    // Luego validar la longitud
    if (value.length < 10) {
      return {
        mailMinLength: { requiredLength: 10, actualLength: value.length },
      };
    }

    if (value.length > 50) {
      return {
        mailMaxLength: { requiredLength: 50, actualLength: value.length },
      };
    }

    return null;
  }

  // Validador para password (min 8, max 30 caracteres)
  static passwordValidatorWithLength(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    if (typeof value !== 'string') {
      return { invalidType: true };
    }

    // Validar longitud primero
    if (value.length < 8) {
      return {
        passwordMinLength: { requiredLength: 8, actualLength: value.length },
      };
    }

    if (value.length > 30) {
      return {
        passwordMaxLength: { requiredLength: 30, actualLength: value.length },
      };
    }

    // Validar patrón de contraseña segura
    const regex = new RegExp(FormUtils.passwordPattern);
    if (!regex.test(value)) {
      return { weakPassword: true };
    }

    return null;
  }

  // Validador para grupo de campos de dirección
  static addressGroupValidator(form: FormGroup): ValidationErrors | null {
    const address = form.get('address')?.value;
    const city = form.get('city')?.value;
    const state = form.get('state')?.value;
    const zip = form.get('zip')?.value;

    // Si al menos uno de los campos de dirección tiene valor, todos deben tener valor
    const hasAnyAddressField = address || city || state || zip;

    if (hasAnyAddressField) {
      const hasAllAddressFields = address && city && state && zip;
      if (!hasAllAddressFields) {
        return { incompleteAddress: true };
      }
    }

    return null;
  }
}
