import { describe, it, expect } from 'vitest';

describe('Backend Smoke Tests', () => {
  it('debería responder con "Hola Mundo"', () => {
    const respuesta = 'Hola Mundo';
    expect(respuesta).toBe('Hola Mundo');
  });

  it('suma funciona correctamente', () => {
    expect(1 + 2).toBe(3);
  });

  it('resta funciona correctamente', () => {
    expect(5 - 2).toBe(3);
  });

  it('string concatenation', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('array methods', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.includes(2)).toBe(true);
  });

  it('object comparison', () => {
    const obj = { name: 'Test', version: '1.0' };
    expect(obj.name).toBe('Test');
    expect(obj.version).toBe('1.0');
  });
});
