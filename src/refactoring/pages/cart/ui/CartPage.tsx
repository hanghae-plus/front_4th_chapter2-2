import { ProductList } from '../../../widgets/product/ui/ProductList.tsx';
import { CartView } from '../../../widgets/cart/ui/CartView.tsx';
import { CartContextProvider } from './CartContextProvider.tsx';
import { CartTotalContextProvider } from './CartTotalContextProvider.tsx';

export const CartPage = () => {
  return (
    <CartContextProvider>
      <CartTotalContextProvider>
        <ProductList />
        <CartView />
      </CartTotalContextProvider>
    </CartContextProvider>
  );
};
