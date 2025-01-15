import { CartItem, Coupon, Product } from "../../types";

export const getMaxApplicableDiscount = ({ product, quantity }: CartItem) => {
  const 유효한_할인 = product.discounts.filter(
    (d) => quantity >= d.quantity
  );

  return 유효한_할인.reduce((총할인율, 할인) => {
    return quantity >= 할인.quantity && 할인.rate > 총할인율 ? 할인.rate : 총할인율;
  }, 0);
};
const 총할인율of = getMaxApplicableDiscount;

export const calculateItemTotal = (cartItem: CartItem) => {
  return cartItem.product.price * cartItem.quantity * (1 - 총할인율of(cartItem));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon?: Coupon
) => {
  let 상품_금액 = 0, 최종결제금액 = 0;
  for (const cartItem of cart) {
    const { product, quantity } = cartItem;
    const { price } = product;

    상품_금액 += (price * quantity);
    최종결제금액 += (price * quantity * (1 - 총할인율of(cartItem)));
  }

  // 쿠폰 적용
  if (selectedCoupon != null) {
    if (selectedCoupon.discountType === "amount") {
      최종결제금액 = Math.max(
        0,
        최종결제금액 - selectedCoupon.discountValue
      );
    } else {
      최종결제금액 *= 1 - selectedCoupon.discountValue / 100;
    }

    return {
      totalBeforeDiscount: Math.round(상품_금액),
      totalAfterDiscount: Math.round(최종결제금액),
      totalDiscount: Math.round(상품_금액 - 최종결제금액),
    };
  }

  return {
    totalBeforeDiscount: Math.round(상품_금액),
    totalAfterDiscount: Math.round(최종결제금액),
    totalDiscount: Math.round(상품_금액 - 최종결제금액),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, 담은수량: number) => {
  return cart.map((x) => {
    if (x.product.id !== productId) {
      return x;
    }

    const 재고 = x.product.stock;
    const 늘어난_수량 = Math.min(담은수량, 재고);

    if (늘어난_수량 <= 0) {
      return null;
    }

    return { ...x, quantity: 늘어난_수량 };
  }).filter((x) => x != null)
}

export const 장바구니에서_상품추가 = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find(x => x.product.id === product.id);
  const is품절 = (product.stock - (cartItem?.quantity || 0)) <= 0;

  if (is품절) {
    return cart;
  }

  const existsProduct = cart.find(x => x.product.id === product.id) != null;
  if (existsProduct) {
    return cart.map(x =>
      x.product.id === product.id
        ? { ...x, quantity: Math.min(x.quantity + 1, product.stock) }
        : x
    );
  }

  return [...cart, { product, quantity: 1 }];
}

export const 장바구니에서_상품빼기 = (cart: CartItem[], productId: Product['id']) => {
  return cart.filter(x => x.product.id !== productId)
}