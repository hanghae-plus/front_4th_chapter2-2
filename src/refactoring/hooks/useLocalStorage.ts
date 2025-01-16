/**
 * @todo setLocalStorage의 방식
 * 1. addtocart -> 카트 추가할 때 로컬스트리지에 값을 추가한다 .
 * 2. remove -> 카트 삭제될 때 로컬스토리지에 값을 제거한다.
 * 3. update -> 카트 내부의 수량을 조절한다.
 */
/**
 * @todo
 * 로컬스토리지 -> 새로고침해도 데이터가 유지된다.
 *
 * 1. 요구사항 -> 저장이 될 때마다 로컬스토리지 데이터에 저장한다.
 * 2. 새로고침이 될 떄 로컬스토리지에서 데이터를 읽어온다
 *
 * 커스텀 훅으로 만들기 (상태)
 * const [cart, setCart] = useLocalStorage('cart');
 */

import { CartItem } from "../../types";

/**
 * @description 로컬스토리지에서 프로덕트 데이터를 주고받는 커스텀 훅
 * @param cart
 * @returns getLocalStorage / addLocalStorage / updateLocalStorage
 */
export const useLocalStorage = () => {
  const getLocalStorage = () => {
    const cart = window.localStorage.getItem("cart");
    if (!cart) return;
    /**
     * @todo cart가 없으면 빈배열을 리턴할건지??
     * */
    return JSON.parse(cart);
  };

  const addLocalStorage = (cart: CartItem[]) => {
    window.localStorage.setItem("cart", JSON.stringify(cart));
  };

  const updateLocalStorage = (cart: CartItem[]) => {
    console.log("ttt", cart);
    console.log("asdf", getLocalStorage());
    return 1;
  };
  return {
    getLocalStorage,
    addLocalStorage,
    updateLocalStorage,
  };
};
