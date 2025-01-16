import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, Coupon, Product } from "../../models/cart/types";
import { getRemainingStock } from "../../utils";
import { calculateCartTotal } from "../../models/cart";
import { useState } from "react";

export const useCartAPI = () => {
  const queryClient = useQueryClient();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니 조회
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      const data = await response.json();
      // API 응답 구조에 맞게 수정
      return data.data || []; // API가 { data: [] } 형태로 응답하므로
    },
    initialData: [],
  });

  // 장바구니 추가/수정
  const addToCart = useMutation({
    mutationFn: async (product: Product) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        return Promise.reject(new Error("재고가 부족합니다"));
      }

      const existingItem = cart.find(
        (item: CartItem) => item.product.id === product.id
      );
      const newItem = existingItem
        ? {
            ...existingItem,
            quantity: Math.min(existingItem.quantity + 1, product.stock),
          }
        : { product, quantity: 1 };

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 장바구니 수량 업데이트
  const updateQuantity = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const item = cart.find((item: CartItem) => item.product.id === productId);
      if (!item) {
        return Promise.reject(new Error("상품을 찾을 수 없습니다"));
      }

      const updatedItem = { ...item, quantity };
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 장바구니 아이템 삭제
  const removeFromCart = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      // 204 응답은 성공이지만 내용이 없는 경우
      if (res.status === 204) {
        return null;
      }

      // 404 등 에러 응답
      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Failed to remove item:", error);
    },
  });

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 총액 계산
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return {
    cart,
    addToCart: addToCart.mutate,
    removeFromCart: removeFromCart.mutate,
    updateQuantity: updateQuantity.mutate,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
