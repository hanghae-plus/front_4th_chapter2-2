import { memo } from "react";
import { CartItem, Product } from "../../../types";
import ProductItemCard from "./ProductItemCard";

const ProductListSection = ({
  cart,
  products,
  onAddToCart,
}: {
  cart: CartItem[];
  products: Product[];
  onAddToCart: (product: Product) => void;
}) => {
  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const remainingStock = getRemainingStock(product);

        return (
          <ProductItemCard
            key={product.id}
            product={product}
            remainingStock={remainingStock}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </div>
  );
};

export default memo(ProductListSection);
