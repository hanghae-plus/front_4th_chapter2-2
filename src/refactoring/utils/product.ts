import { ProductType, DiscountType } from '../types';

/**
 * 제품의 특정 필드를 업데이트
 *
 * @param {string} productId - 업데이트할 제품의 ID
 * @param {keyof ProductType} field - 업데이트할 제품의 필드
 * @param {any} value - 필드에 설정할 새로운 값
 * @param {ProductType | null} editingProduct - 현재 편집 중인 제품 또는 null
 * @param {React.Dispatch<React.SetStateAction<ProductType | null>>} setEditingProduct - 편집 중인 제품 상태 업데이트 함수
 */
export const updateProductField = (
  productId: string,
  field: keyof ProductType,
  value: ProductType[keyof ProductType],
  editingProduct: ProductType | null,
  setEditingProduct: React.Dispatch<React.SetStateAction<ProductType | null>>,
) => {
  if (editingProduct && editingProduct.id === productId) {
    const updatedProduct = { ...editingProduct, [field]: value };
    setEditingProduct(updatedProduct);
  }
};

/**
 * 제품에 할인을 추가하거나 제거
 *
 * @param {string} productId - 업데이트할 제품의 ID
 * @param {DiscountType} discount - 추가하거나 제거할 할인
 * @param {boolean} isAdd - 할인을 추가할지 제거할지를 나타내는 플래그
 * @param {ProductType[]} productList - 전체 제품 목록
 * @param {(updatedProduct: ProductType) => void} onProductUpdate - 제품 목록을 업데이트하
 * @param {React.Dispatch<React.SetStateAction<ProductType | null>>} setEditingProduct - 편집 중인 제품 상태 업데이트 함수.
 */
export const handleAddOrRemoveDiscount = (
  productId: string,
  discount: DiscountType,
  isAdd: boolean,
  productList: ProductType[],
  onProductUpdate: (updatedProduct: ProductType) => void,
  setEditingProduct: React.Dispatch<React.SetStateAction<ProductType | null>>,
) => {
  const updatedProduct = productList.find((p) => p.id === productId);

  if (updatedProduct) {
    const updatedDiscounts = isAdd
      ? [...updatedProduct.discounts, discount]
      : updatedProduct.discounts.filter((d) => d !== discount);

    const newProduct = { ...updatedProduct, discounts: updatedDiscounts };

    onProductUpdate(newProduct);
    setEditingProduct(newProduct);
  }
};
