import { CartItem, Product } from '@types';
import { ProductItem } from './ProductItem';
import { Heading } from '../shared/Heading';

interface ProductListProps {
  cart: CartItem[];
  products: Product[];
  addToCart: (product: Product) => void;
}

export function ProductList({ cart, addToCart, products }: ProductListProps) {
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        상품 목록
      </Heading>
      <div className="space-y-2">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            cart={cart}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}
