import { Coupon } from '..';

export const getCoupons = async () => {
  const response = await fetch('/api/coupons', { method: 'GET' });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { coupons: Coupon[] };
  return data.coupons;
};

export const addCoupon = async (coupon: Coupon) => {
  const response = await fetch('/api/coupons', {
    method: 'PUT',
    body: JSON.stringify(coupon),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as Coupon;
  return data;
};
