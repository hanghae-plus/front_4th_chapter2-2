import { useProductStore } from '../../../entities/product/model/useProductStore';
import { CartItem, Product } from '../../../shared/types/types';
import { calculateMaxDiscount, getRemainingStock } from '../lib';
import ProductItem from './ProductItem';

interface ProductListProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

function ProductList(props: ProductListProps) {
  const { cart, onAddToCart } = props;
  const { products } = useProductStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => {
          const remainingStock = getRemainingStock(product, cart);
          const maxDiscount = calculateMaxDiscount(product.discounts);
          return (
            <ProductItem
              key={product.id}
              product={product}
              remainingStock={remainingStock}
              maxDiscount={maxDiscount}
              onAddToCart={onAddToCart}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;
