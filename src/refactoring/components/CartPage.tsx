import { Coupon, Product } from "../../types.ts";
import Title from "./atoms/Title.tsx";
import { CartList } from "./cart/cartList/CartList/CartList.tsx";
import { CartProductList } from "./cart/cartProduct/CartProductList/CartProductList.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  return (
    <div className="container mx-auto p-4">
      <Title level={1} text="장바구니" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CartProductList products={products} />
        <CartList coupons={coupons} />
      </div>
    </div>
  );
};
