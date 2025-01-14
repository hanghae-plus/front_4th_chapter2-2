import {CartItem, Product} from "../../types.ts";

// 새로운 카트 아이템 생성
export const createCartItem = (product: Product): CartItem => {
    return {product, quantity: 1};
}

// 존재하는 카드 아이템 찾기
export const findExistingItem = (cart: CartItem[], product: Product): CartItem | undefined => {
    return cart.find(item => item.product.id === product.id);
}

// 카트 아이템 수량 1(개) 증가
export const updateQuantity = (item: CartItem): CartItem => {
    return {...item, quantity: item.quantity + 1};
}

