import { useState, useCallback } from 'react';
import { CartItemType, DiscountType, ProductType } from '../types';

/**
 * 할인 계산 로직을 위한 커스텀 훅
 *
 * @param {CartItemType[]} cart - 장바구니에 담긴 제품 목록
 * @returns {object} - 할인 계산 관련된 값과 함수들
 */
export const useDiscountCalculator = (cart: CartItemType[]) => {
  const [appliedDiscounts, setAppliedDiscounts] = useState<Map<string, number>>(new Map());

  // 주어진 할인 목록에서 최대 할인율을 계산
  const getMaxDiscount = useCallback(
    (discountList: DiscountType[]) =>
      discountList.reduce((max, discount) => Math.max(max, discount.rate), 0),
    [],
  );

  // 장바구니에 있는 제품의 남은 재고를 계산
  const getRemainingStock = useCallback(
    (product: ProductType) => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      return product.stock - (cartItem?.quantity || 0);
    },
    [cart],
  );

  // 장바구니에 담긴 제품에 적용된 할인을 계산
  const getAppliedDiscount = useCallback((item: CartItemType) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  }, []);

  // 장바구니에 담긴 모든 제품에 대해 할인율을 계산하고 상태를 업데이트
  const updateDiscounts = useCallback(() => {
    const newAppliedDiscounts = new Map<string, number>();
    let discountsChanged = false;

    cart.forEach((item) => {
      const discount = getAppliedDiscount(item);
      const currentDiscount = appliedDiscounts.get(item.product.id);

      // 할인율이 변경된 경우에만 상태 업데이트
      if (discount !== currentDiscount) {
        newAppliedDiscounts.set(item.product.id, discount);
        discountsChanged = true;
      }
    });

    if (discountsChanged) {
      setAppliedDiscounts(newAppliedDiscounts);
    }
  }, [cart, getAppliedDiscount, appliedDiscounts]);

  return {
    appliedDiscounts,
    getMaxDiscount,
    getRemainingStock,
    getAppliedDiscount,
    updateDiscounts,
  };
};
