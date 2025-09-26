import { StatusTranslatePipe } from './status-translate.pipe';

describe('StatusTranslatePipe', () => {
  let pipe: StatusTranslatePipe;

  beforeEach(() => {
    pipe = new StatusTranslatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate "alive" to "Vivo"', () => {
    expect(pipe.transform('alive')).toBe('Vivo');
  });

  it('should translate "Alive" (uppercase) to "Vivo"', () => {
    expect(pipe.transform('Alive')).toBe('Vivo');
  });

  it('should translate "ALIVE" (all caps) to "Vivo"', () => {
    expect(pipe.transform('ALIVE')).toBe('Vivo');
  });

  it('should translate "dead" to "Muerto"', () => {
    expect(pipe.transform('dead')).toBe('Muerto');
  });

  it('should translate "Dead" (uppercase) to "Muerto"', () => {
    expect(pipe.transform('Dead')).toBe('Muerto');
  });

  it('should translate "DEAD" (all caps) to "Muerto"', () => {
    expect(pipe.transform('DEAD')).toBe('Muerto');
  });

  it('should translate "unknown" to "Desconocido"', () => {
    expect(pipe.transform('unknown')).toBe('Desconocido');
  });

  it('should translate "Unknown" (uppercase) to "Desconocido"', () => {
    expect(pipe.transform('Unknown')).toBe('Desconocido');
  });

  it('should translate "UNKNOWN" (all caps) to "Desconocido"', () => {
    expect(pipe.transform('UNKNOWN')).toBe('Desconocido');
  });

  it('should return original value for unrecognized status', () => {
    expect(pipe.transform('inactive')).toBe('inactive');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle mixed case', () => {
    expect(pipe.transform('AliVe')).toBe('Vivo');
    expect(pipe.transform('DeAd')).toBe('Muerto');
  });
});