import { Coupon, Discount } from '../../../types';

export interface CartTotalResult {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export interface CouponManagerProps {
  coupons: Coupon[];
  newCoupon: Coupon;
  onCouponChange: (coupon: Coupon) => void;
  onAddCoupon: () => void;
}

export interface DiscountFormProps {
  newDiscount: Discount;
  onNewDiscountChange: (discount: Discount) => void;
  onAddDiscount: () => void;
}

export interface DiscountType {
  quantity: number;
  rate: number;
}
