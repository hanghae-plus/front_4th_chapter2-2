import { Product, Coupon, Discount } from '../../types';

// 초기 상품 리스트
export const initialProductList: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

// 초기 쿠폰 리스트
export const initialCouponList: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// 초기 할인 값
export const INITIAL_DISCOUNT_STATE: Discount = {
  quantity: 0,
  rate: 0,
};

// 초기 상품 값
export const INITIAL_PRODUCT_STATE: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

// 초기 쿠폰 값
export const INITIAL_COUPON_STATE: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
};
