const chunk = (array: any[], size: number) => {
  if (!Array.isArray(array) || size <= 0) {
    return [];
  }

  const result = [];
  let index = 0;

  while (index < array.length) {
    result.push(array.slice(index, index + size));
    index += size;
  }

  return result;
};

export default chunk