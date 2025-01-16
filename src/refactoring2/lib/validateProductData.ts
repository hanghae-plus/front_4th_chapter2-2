export const validateProductData = (data: any) => {
  if (data == null) return false;

  if (typeof data !== 'object' || Array.isArray(data)) return false;

  return Object.entries(data).every(([key, value]) => {
    if (key === 'id') {
      return typeof value === 'string';
    }

    if (key === 'name') {
      return typeof value === 'string';
    }

    if (key === 'price') {
      return typeof value === 'number' && value > 0;
    }

    if (key === 'stock') {
      return typeof value === 'number' && value > 0;
    }

    if (key === 'discounts') {
      return (
        Array.isArray(value) &&
        value.every(({ quantity, rate }) => {
          return (
            typeof quantity === 'number' && quantity > 0 && typeof rate === 'number' && rate > 0
          );
        })
      );
    }

    return false;
  });
};
