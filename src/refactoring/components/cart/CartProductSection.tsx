import React from "react";
import { CartItem, Product } from "../../../types.ts";

import { getMaxDiscount, getRemainingStock } from "../../models/cart.ts";
import { CartProductCard } from "./CartProductCard.tsx";

interface Props {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

const CartProductSection = ({ products, cart, addToCart }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <CartProductCard
            key={product.id}
            product={product}
            remainingStock={getRemainingStock(cart, product)}
            maxDiscount={getMaxDiscount(product.discounts)}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(CartProductSection);
