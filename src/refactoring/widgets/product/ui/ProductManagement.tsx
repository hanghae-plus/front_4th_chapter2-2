import { SectionTitle } from '../../../shared/ui/typography';
import { ProductForm } from '../../../features/product/ui/ProductForm.tsx';
import { useProductContext } from '../../../entities/product/model';
import { Product } from '../../../features/product/ui/Product.tsx';

export function ProductManagement() {
  const { products, updateProduct, addProduct } = useProductContext();

  return (
    <div>
      <SectionTitle title={'상품 관리'} />
      <ProductForm onProductAdd={addProduct} />
      <div className="space-y-2">
        {products.map((product, index) => (
          <Product
            key={product.id}
            index={index}
            product={product}
            updateProduct={updateProduct}
          />
        ))}
      </div>
    </div>
  );
}
