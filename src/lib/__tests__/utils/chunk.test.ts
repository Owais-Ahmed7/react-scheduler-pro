import chunk from '../../utils/chunk';

describe('chunk', () => {
  it('should split array into chunks of specified size', () => {
    const result = chunk([1, 2, 3, 4, 5, 6], 2);
    expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it('should handle arrays not evenly divisible', () => {
    const result = chunk([1, 2, 3, 4, 5], 2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should handle chunk size of 1', () => {
    const result = chunk([1, 2, 3], 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should handle chunk size larger than array', () => {
    const result = chunk([1, 2], 5);
    expect(result).toEqual([[1, 2]]);
  });

  it('should handle empty array', () => {
    const result = chunk([], 3);
    expect(result).toEqual([]);
  });

  it('should work with 7 (days in a week)', () => {
    const days = Array.from({ length: 35 }, (_, i) => i + 1);
    const result = chunk(days, 7);
    expect(result).toHaveLength(5);
    expect(result[0]).toHaveLength(7);
  });
});
