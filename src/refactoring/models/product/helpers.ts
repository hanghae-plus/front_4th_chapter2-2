export const validateProductQuantity = (
  currentQuantity: number,
  newQuantity: number
) => {
  const validatedQuantity = Math.max(0, Math.min(newQuantity, currentQuantity));
  return validatedQuantity;
};
