import { CartItem, Product } from '../../../../types';
import { TextButton } from '../../../shared/ui';
import { DiscountCondition } from '../../../entities/discount/ui/DiscountCondition';
import { ProductDisplay, ProductTitle, ProductDesc } from '../../../entities/product/ui';
import { getRemainingStock } from '../lib/getRemainingStock';
import { useProductContext } from '../../../entities/product/model/useProductContext.ts';

interface ProductListProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

function ProductList({ cart, addToCart }: ProductListProps) {
  const { products } = useProductContext();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => {
          const remainingStock = getRemainingStock(cart, product);

          return (
            <ProductDisplay key={product.id} product={product}>
              <ProductTitle product={product} />
              <ProductDesc product={product} remainingStock={remainingStock} />
              <DiscountCondition discounts={product.discounts} />
              <TextButton
                variant="add"
                title={remainingStock > 0 ? '장바구니에 추가' : '품절'}
                onClick={() => addToCart(product)}
                isDisabled={remainingStock <= 0}
                fullWidth
              />
            </ProductDisplay>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;
