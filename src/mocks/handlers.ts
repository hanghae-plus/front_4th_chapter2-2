import { couponsHandlers } from './apis/coupon';
import { productHandlers } from './apis/products';

export const handlers = [...productHandlers, ...couponsHandlers];
