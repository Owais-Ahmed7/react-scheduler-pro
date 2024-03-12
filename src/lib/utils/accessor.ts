export const accessor = (field: string, event: any) => {
  if (field) {
    const propertyNames = field.split('.');
    const nestedPropertyValue = propertyNames.reduce(
      (obj: any, propName: any) => obj && obj[propName],
      event
    );
    return nestedPropertyValue;
  } else return '';
};
