import { Product } from "../../../../../types";
import Title from "../../../atoms/Title";
import { CartProductCard } from "../CartProductCard/CartProductCard";

interface CartProductListProps {
  products: Product[];
}

export const CartProductList = ({ products }: CartProductListProps) => {
  return (
    <div>
      <Title level={2} mbNum={4} text="상품 목록" />
      <CartProductCard products={products} />
    </div>
  );
};
