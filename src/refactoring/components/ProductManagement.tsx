import { useState } from 'react';
import { Product } from '../../types';
import { useProductDiscount } from '../hooks/useProductDiscount';
import { getProductTitle, isProductEditing } from '../utils/productUtils';
import DiscountsWithModifyButton from './DiscountsWithModifyButton';
import EditingProduct from './EditingProduct';
import NewProductForm from './NewProductForm';
import ProductAccordion from './ProductAccordion';

interface Props {
  productList: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}
export default function ProductManagement({ productList, onProductUpdate, onProductAdd }: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // handleEditProduct 함수 수정
  const onProductEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const { newDiscount, addDiscount, removeDiscount, updateDiscount } = useProductDiscount(
    editingProduct,
    productList,
    onProductUpdate,
    setEditingProduct,
  );

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
      <NewProductForm onProductAdd={onProductAdd} />

      <div className='space-y-2'>
        {productList.map((product, index) => (
          <div
            key={product.id}
            data-testid={`product-${index + 1}`}
            className='bg-white p-4 rounded shadow'
          >
            <ProductAccordion id={product.id} title={getProductTitle(product)}>
              {isProductEditing(editingProduct, product.id) ? (
                <EditingProduct
                  product={product}
                  productList={productList}
                  editingProduct={editingProduct}
                  setEditingProduct={setEditingProduct}
                  onProductUpdate={onProductUpdate}
                  newDiscount={newDiscount}
                  onDiscountAdd={addDiscount}
                  onDiscountRemove={removeDiscount}
                  onDiscountUpdate={updateDiscount}
                />
              ) : (
                <DiscountsWithModifyButton product={product} onProductEdit={onProductEdit} />
              )}
            </ProductAccordion>
          </div>
        ))}
      </div>
    </div>
  );
}
