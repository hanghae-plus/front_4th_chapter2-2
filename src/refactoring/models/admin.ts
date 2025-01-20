import { Product, Coupon } from 'src/types';

// 상태 초기화 함수: Product
export const initializeNewProduct = (): Omit<Product, 'id'> => ({
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
});

// 상태 초기화 함수: Coupon
export const initializeNewCoupon = (): Coupon => ({
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
});
