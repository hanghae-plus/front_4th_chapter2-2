import { Coupon, Product } from '../../types';

export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validatePrice = (price: number): boolean => {
  return price !== null && price >= 0;
};

export const validateStock = (stock: number): boolean => {
  return stock !== null && stock >= 0;
};

export const validateDiscount = (quantity: number, rate: number): boolean => {
  return quantity !== null && quantity > 0 && rate !== null && rate >= 0 && rate <= 100;
};

export const validateCouponValue = (
  discountType: 'amount' | 'percentage',
  value: number
): boolean => {
  if (!value || value < 0) return false;

  if (discountType === 'amount') {
    return value >= 1;
  }

  if (discountType === 'percentage') {
    return value >= 1 && value <= 100;
  }

  return false;
};

export const validateProductData = (product: Omit<Product, 'id' | 'discounts'>): boolean => {
  if (!validateName(product.name)) return false;
  if (!validatePrice(product.price)) return false;
  if (!validateStock(product.stock)) return false;

  return true;
};

export const validateCouponData = (coupon: Coupon): boolean => {
  if (!validateName(coupon.name)) return false;
  if (!validateName(coupon.code)) return false;
  if (!validateCouponValue(coupon.discountType, coupon.discountValue)) return false;

  return true;
};
