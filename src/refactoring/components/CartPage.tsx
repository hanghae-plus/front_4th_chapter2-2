import Title from './atoms/Title.tsx';
import { CartList } from './cart/cartList/CartList.tsx';
import { CartProductList } from './cart/cartProduct/CartProductList/CartProductList.tsx';

export const CartPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Title level={1} text="장바구니" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CartProductList />
        <CartList />
      </div>
    </div>
  );
};
