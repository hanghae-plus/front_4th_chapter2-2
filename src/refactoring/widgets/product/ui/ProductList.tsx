import { SectionTitle } from '../../../shared/ui/typography';
import { Stock } from '../../../features/stock/ui/Stock.tsx';
import { ICartItem, IProduct } from '../../../shared/types';

interface ProductListProps {
  products: IProduct[];
  cart: ICartItem[];
  addToCart: (product: IProduct) => void;
}

export function ProductList({ products, cart, addToCart }: ProductListProps) {
  const getRemainingStock = (product: IProduct) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return (
    <div>
      <SectionTitle title={'상품 목록'} />
      <div className="space-y-2">
        {products.map((product) => (
          <Stock
            key={product.id}
            product={product}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
          />
        ))}
      </div>
    </div>
  );
}
