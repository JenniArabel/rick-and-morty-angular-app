import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderTranslate',
  standalone: true,
})
export class GenderTranslatePipe implements PipeTransform {
  transform(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      case 'genderless':
        return 'Sin género';
      case 'unknown':
        return 'Desconocido';
      default:
        return gender;
    }
  }
}
