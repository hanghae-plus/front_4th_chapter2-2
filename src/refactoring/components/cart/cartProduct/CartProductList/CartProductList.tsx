import { useCart, useProducts } from '../../../../hooks';
import Title from '../../../atoms/Title';
import { CartProductCard } from './CartProductCard/CartProductCard';

export const CartProductList = () => {
  const { getRemainingStock } = useCart();
  const { products } = useProducts();

  return (
    <div>
      <Title level={2} mbNum={4} text="상품 목록" />
      {products.map(product => (
        <CartProductCard key={product.id} product={product} remainingStock={getRemainingStock(product)} />
      ))}
    </div>
  );
};
