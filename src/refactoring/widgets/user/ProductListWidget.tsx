import ProductList from '../../features/products/ProductList';
import { Product } from '../../shared/types/types';

interface ProductListWidgetProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
}

const ProductListWidget = (props: ProductListWidgetProps) => {
  const { products, onAddToCart, getRemainingStock, getMaxDiscount } = props;
  return (
    <div>
      <ProductList
        products={products}
        onAddToCart={onAddToCart}
        getRemainingStock={getRemainingStock}
        getMaxDiscount={getMaxDiscount}
      />
    </div>
  );
};

export default ProductListWidget;
