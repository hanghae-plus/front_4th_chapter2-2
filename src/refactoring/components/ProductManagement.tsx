import { useState } from 'react';
import { Product } from '../../types';
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
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const getProductTitle = (product: Product) =>
    `${product.name} - ${product.price}원 (재고: ${product.stock})`;

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
              {editingProduct && editingProduct.id === product.id ? (
                <EditingProduct
                  product={product}
                  productList={productList}
                  editingProduct={editingProduct}
                  setEditingProduct={setEditingProduct}
                  onProductUpdate={onProductUpdate}
                />
              ) : (
                <div>
                  {product.discounts.map((discount, index) => (
                    <div key={index} className='mb-2'>
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                      </span>
                    </div>
                  ))}
                  <button
                    data-testid='modify-button'
                    onClick={() => handleEditProduct(product)}
                    className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'
                  >
                    수정
                  </button>
                </div>
              )}
            </ProductAccordion>
          </div>
        ))}
      </div>
    </div>
  );
}
