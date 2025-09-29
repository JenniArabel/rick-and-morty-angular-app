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
  static readonly passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$';


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

        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;

        case 'notStrider':
          return 'El nombre de usuario no puede ser "strider"';

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }

          return 'El valor ingresado no tiene el formato esperado';

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
}
