/**
 * @todo setLocalStorage의 방식
 * 1. addtocart -> 카트 추가할 때 로컬스트리지에 값을 추가한다 .
 * 2. remove -> 카트 삭제될 때 로컬스토리지에 값을 제거한다.
 * 3. update -> 카트 내부의 수량을 조절한다.
 */

import { CartItem } from "../../types";

/**
 * @description 로컬스토리지에서 프로덕트 데이터를 주고받는 커스텀 훅
 * @param cart
 * @returns getLocalStorage / setLocalStorage
 */
export const useLocalStorage = () => {
  const getLocalStorage = () => {
    window.localStorage.getItem("productList");
    return 123;
  };

  const addLocalStorage = (cart: CartItem[]) => {
    window.localStorage.setItem("cart", JSON.stringify(cart));
  };

  const updateLocalStorage = () => {
    return 1;
  };
  return {
    getLocalStorage,
    addLocalStorage,
    updateLocalStorage,
  };
};
