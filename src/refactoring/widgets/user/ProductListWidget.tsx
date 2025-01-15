import ProductList from '../../features/products/ProductList';
import { CartItem, Product } from '../../shared/types/types';

interface ProductListWidgetProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

const ProductListWidget = (props: ProductListWidgetProps) => {
  const { cart, onAddToCart } = props;

  return (
    <div>
      <ProductList cart={cart} onAddToCart={onAddToCart} />
    </div>
  );
};

export default ProductListWidget;
