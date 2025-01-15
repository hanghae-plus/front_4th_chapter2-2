import { Product } from '../../types';
import { useProductDiscount } from '../hooks/useProductDiscount';
import { useProductEdit } from '../hooks/useProductEdit';
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
  const productEdit = useProductEdit(onProductUpdate, productList);
  const { newDiscount, addDiscount, removeDiscount, updateDiscount } = useProductDiscount(
    productEdit.editingProduct,
    productEdit.setEditingProduct,
    productList,
    onProductUpdate,
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
              {isProductEditing(productEdit.editingProduct, product.id) ? (
                <EditingProduct
                  product={product}
                  productEdit={{ ...productEdit, editingProduct: productEdit.editingProduct }}
                  newDiscount={newDiscount}
                  onDiscountAdd={addDiscount}
                  onDiscountRemove={removeDiscount}
                  onDiscountUpdate={updateDiscount}
                />
              ) : (
                <DiscountsWithModifyButton
                  product={product}
                  onProductEdit={productEdit.updateProduct}
                />
              )}
            </ProductAccordion>
          </div>
        ))}
      </div>
    </div>
  );
}
