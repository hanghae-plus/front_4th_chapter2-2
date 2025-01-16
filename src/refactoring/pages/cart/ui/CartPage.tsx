import { ProductList } from '../../../widgets/product/ui/ProductList.tsx';
import { CartView } from '../../../widgets/cart/ui/CartView.tsx';
import { CartContextProvider } from '../../providers/CartContextProvider.tsx';

export const CartPage = () => {
  return (
    <CartContextProvider>
      <ProductList />
      <CartView />
    </CartContextProvider>
  );
};
