import { accessor } from '../../utils/accessor';

describe('accessor', () => {
  it('should access top-level properties', () => {
    const obj = { name: 'Test Event' };
    expect(accessor('name', obj)).toBe('Test Event');
  });

  it('should access nested properties with dot notation', () => {
    const obj = { backgroundColor: { color: '#ff0000' } };
    expect(accessor('backgroundColor.color', obj)).toBe('#ff0000');
  });

  it('should access deeply nested properties', () => {
    const obj = { a: { b: { c: { d: 'deep value' } } } };
    expect(accessor('a.b.c.d', obj)).toBe('deep value');
  });

  it('should return undefined for non-existent properties', () => {
    const obj = { name: 'Test' };
    expect(accessor('nonexistent', obj)).toBeUndefined();
  });

  it('should return undefined for non-existent nested path', () => {
    const obj = { a: { b: 'value' } };
    expect(accessor('a.c.d', obj)).toBeUndefined();
  });

  it('should return empty string for empty key', () => {
    const obj = { '': 'empty key' };
    expect(accessor('', obj)).toBe('');
  });
});
