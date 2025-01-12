import { validateProductQuantity } from "../product/helpers";

export const validateCartItemQuantity = (item: any, newQuantity: number) => {
  const validQuantity = validateProductQuantity(
    item.product.stock,
    newQuantity
  );

  if (validQuantity > 0) {
    return { ...item, quantity: validQuantity };
  } else {
    return null;
  }
};

// export const calculateItemTotal = (item: CartItem) => {
//   return 0;
// };

// export const getMaxApplicableDiscount = (item: CartItem) => {
//   return 0;
// };

// export const calculateCartTotal = (
//   cart: CartItem[],
//   selectedCoupon: Coupon | null
// ) => {
//   return {
//     totalBeforeDiscount: 0,
//     totalAfterDiscount: 0,
//     totalDiscount: 0,
//   };
// };
