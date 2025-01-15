import ProductList from '../../features/products/ProductList';
import { Product } from '../../shared/types/types';

interface ProductListWidgetProps {
  onAddToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
}

const ProductListWidget = (props: ProductListWidgetProps) => {
  const { onAddToCart, getRemainingStock, getMaxDiscount } = props;
  return (
    <div>
      <ProductList onAddToCart={onAddToCart} getRemainingStock={getRemainingStock} getMaxDiscount={getMaxDiscount} />
    </div>
  );
};

export default ProductListWidget;
