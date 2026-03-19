export const accessor = (field: string | undefined, event: Record<string, unknown>): unknown => {
  if (field) {
    const propertyNames = field.split('.');
    const nestedPropertyValue = propertyNames.reduce<unknown>(
      (obj, propName) => {
        if (obj && typeof obj === 'object' && propName in (obj as Record<string, unknown>)) {
          return (obj as Record<string, unknown>)[propName];
        }
        return undefined;
      },
      event
    );
    return nestedPropertyValue;
  } else return '';
};
