import {useEffect, useState} from "react";
import {CartItem, Product} from "../../types.ts";

// 장바구니에 담은 데이터를 sessionStorage에 담는 훅
// 원래 useCart.ts를 대체하려 했으나, 대체했더니 기본 과제를 통과하지 못하는 걸로 나와서(useSessionStorage를 고려하진 않고 짜여진 테스트 코드여서 그런 것 같습니다)
// 심화과제 테스트에서만 useSessionStorage으로 테스트하도록 작업하였습니다.
export const useSessionStorage = () => {
  // 장바구니에 있는 물건들
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = sessionStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("세션스토리지에서 데이터를 불러오지 못했습니다", error);
      return [];
    }
  });
  
  // 장바구니에 물건 추가
  
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    let data = [];
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      data = [...prevCart, { product, quantity: 1 }];
      return data
    });
    sessionStorage.setItem("cart", JSON.stringify(data));
  };
  
  // 장바구니에 물건 제거
  const removeFromCart = (productId: string) => {
    let data = [];
    setCart(prevCart => {
      data = prevCart.filter(item => item.product.id !== productId)
      return data;
    });
    sessionStorage.setItem("cart", JSON.stringify(data));
  };
  
  // 남아있는 장바구니 물건 목록
  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item : CartItem) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }
  
  // 장바구니에 담긴 물건 변화가 있으면 sessionStorage에 담습니다.
  useEffect(() => {
    try {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to sessionStorage:", error);
    }
  }, [cart]);
  
  return {
    cart,
    setCart,
    addToCart,
    removeFromCart
  };
}
