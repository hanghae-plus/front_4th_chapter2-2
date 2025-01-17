import { Coupon } from '../../types'

/**
 * 할인율을 백분율 문자열로 변환
 * Ex: 0.15 -> "15%"
 * @param discountRate  - 소수점 형태의 할인율 (예: 0.15는 15%를 의미).
 * @returns {string} - 백분율 문자열로 변환된 할인율 (예: "15%").
 */
export const formatDiscountPercentage = (discountRate: number): string => {
  return `${(discountRate * 100).toFixed(0)}%`
}

/**
 * 쿠폰의 이름과 할인 정보를 포맷팅하여 반환
 * @param coupon: 쿠폰 객체로, 할인 유형 및 할인 값을 포함합니다.
 *      - `name` (string): 쿠폰 이름 (예: "5000원 할인 쿠폰").
 *      - `discountType` ('amount' | 'percentage'): 할인 유형 ('amount'는 금액 할인, 'percentage'는 퍼센트 할인).
 *      - `discountValue` (number): 할인 값 (예: 5000 또는 10).
 * @param displayType: 출력 형식으로, 다음 중 하나를 지정합니다.
 *      - 'full': 쿠폰 이름과 할인 값을 함께 출력합니다 (예: "5000원 할인 쿠폰 - 5000원").
 *      - 'name': 쿠폰 이름만 출력합니다 (예: "5000원 할인 쿠폰").
 *      - 'value': 할인 값만 출력합니다 (예: "5000원" 또는 "10%").
 * @returns {string} - 포맷팅된 쿠폰 표시 문자열 (예: "5000원 할인 쿠폰 - 5000원" 또는 "10% 할인 쿠폰 - 10%")
 */
export const formatCouponDisplay = (
  coupon: Coupon,
  displayType: 'full' | 'name' | 'value'
): string => {
  if (displayType === 'full') {
    return coupon.discountType === 'amount'
      ? `${coupon.name} - ${coupon.discountValue}원`
      : `${coupon.name} - ${coupon.discountValue}%`
  } else if (displayType === 'value') {
    return coupon.discountType === 'amount'
      ? `${coupon.discountValue}원`
      : `${coupon.discountValue}%`
  } else {
    return coupon.name
  }
}
