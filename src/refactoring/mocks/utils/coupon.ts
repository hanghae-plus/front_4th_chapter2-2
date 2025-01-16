import { Coupon } from "../../models/cart/types";
import { initialCoupons } from "../data/coupons";

// 메모리 데이터 관리
export let coupons = [...initialCoupons];

// 쿠폰 목록 조회
export const getCoupons = () => coupons;

// 쿠폰 찾기
export const findCoupon = (code: string) =>
  coupons.find((c) => c.code === code);

// 쿠폰 추가
export const addCoupon = (coupon: Coupon) => {
  coupons = [...coupons, coupon];
  return coupon;
};

// 쿠폰 수정
export const updateCoupon = (code: string, coupon: Coupon) => {
  coupons = coupons.map((c) => (c.code === code ? coupon : c));
  return coupon;
};

// 쿠폰 삭제
export const deleteCoupon = (code: string) => {
  coupons = coupons.filter((c) => c.code !== code);
};

// 쿠폰 목록 전체 업데이트
export const updateCoupons = (newCoupons: Coupon[]) => {
  coupons = newCoupons;
};
