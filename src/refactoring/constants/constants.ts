import { Coupon, Discount, Product } from "../../types";

const INITIAL_PRODUCT_LIST: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const INITIAL_COUPON_LIST: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const INITIAL_PRODUCT: Omit<Product, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  discounts: [],
};

const INITIAL_NEW_COUPON: Coupon = {
  name: "",
  code: "",
  discountType: "percentage",
  discountValue: 0,
};
const INITIAL_NEW_DISCOUNT: Discount = {
  quantity: 0,
  rate: 0,
};

export {
  INITIAL_PRODUCT,
  INITIAL_PRODUCT_LIST,
  INITIAL_NEW_COUPON,
  INITIAL_COUPON_LIST,
  INITIAL_NEW_DISCOUNT,
};
