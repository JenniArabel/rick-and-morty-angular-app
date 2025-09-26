import { GenderTranslatePipe } from './gender-translate.pipe';

describe('GenderTranslatePipe', () => {
  let pipe: GenderTranslatePipe;

  beforeEach(() => {
    pipe = new GenderTranslatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate "male" to "Masculino"', () => {
    expect(pipe.transform('male')).toBe('Masculino');
  });

  it('should translate "Male" (uppercase) to "Masculino"', () => {
    expect(pipe.transform('Male')).toBe('Masculino');
  });

  it('should translate "MALE" (all caps) to "Masculino"', () => {
    expect(pipe.transform('MALE')).toBe('Masculino');
  });

  it('should translate "female" to "Femenino"', () => {
    expect(pipe.transform('female')).toBe('Femenino');
  });

  it('should translate "Female" (uppercase) to "Femenino"', () => {
    expect(pipe.transform('Female')).toBe('Femenino');
  });

  it('should translate "genderless" to "Sin género"', () => {
    expect(pipe.transform('genderless')).toBe('Sin género');
  });

  it('should translate "Genderless" (uppercase) to "Sin género"', () => {
    expect(pipe.transform('Genderless')).toBe('Sin género');
  });

  it('should translate "unknown" to "Desconocido"', () => {
    expect(pipe.transform('unknown')).toBe('Desconocido');
  });

  it('should translate "Unknown" (uppercase) to "Desconocido"', () => {
    expect(pipe.transform('Unknown')).toBe('Desconocido');
  });

  it('should return original value for unrecognized gender', () => {
    expect(pipe.transform('other')).toBe('other');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle mixed case', () => {
    expect(pipe.transform('MaLe')).toBe('Masculino');
    expect(pipe.transform('FeMaLe')).toBe('Femenino');
  });
});