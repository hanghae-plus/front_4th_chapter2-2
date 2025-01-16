import { ProductItem } from '@/refactoring/pages/Cart/features/ProductList/components/ProductItem';
import type { CartItem, Product } from '@/types';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  onCartAdd: (product: Product) => void;
}

export const ProductList = ({ products, cart, onCartAdd }: ProductListProps) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">상품 목록</h2>
      <div className="space-y-2">
        {products.map(product => {
          return <ProductItem key={product.id} product={product} cart={cart} onCartAdd={onCartAdd} />;
        })}
      </div>
    </div>
  );
};
