export const toggleProductInSet = (
  prevProductIds: Set<string>,
  productId: string
) => {
  const newSet = new Set(prevProductIds);
  if (newSet.has(productId)) {
    newSet.delete(productId);
  } else {
    newSet.add(productId);
  }
  return newSet;
};
