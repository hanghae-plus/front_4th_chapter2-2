import { Coupon } from '@advanced/entities/coupon';
import { http, HttpResponse } from 'msw';

let coupons: Coupon[] = [
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

const getCoupons = http.get('/api/coupons', () => {
  return HttpResponse.json({ coupons });
});

const addCoupon = http.put<never, Coupon>(
  '/api/coupons',
  async ({ request }) => {
    const newCoupon = await request.json();

    const newCoupons = [...coupons, newCoupon];

    coupons = newCoupons;

    return HttpResponse.json({ newCoupon });
  },
);

export const couponsHandlers = [getCoupons, addCoupon];
