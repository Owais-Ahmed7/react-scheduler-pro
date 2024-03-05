export const accessor = (field: string, event: any) => {
  const propertyNames = field.split('.');
  const nestedPropertyValue = propertyNames.reduce(
    (obj: any, propName: any) => obj && obj[propName],
    event
  );

  return nestedPropertyValue;
};
