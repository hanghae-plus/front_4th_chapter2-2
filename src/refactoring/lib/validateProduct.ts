import { Product } from "../../types";

interface ValidationErrors {
  name?: string;
  price?: string;
  stock?: string;
}

/**
 * 상품 추가 시 유효성 검사
 * @param newProduct 상품 정보
 * @returns 유효성 검사 결과
 */
function validateProduct(newProduct: Omit<Product, "id">): ValidationErrors {
  const newErrors: ValidationErrors = {};

  // 상품명 검증
  if (!newProduct.name.trim()) {
    newErrors.name = "상품명을 입력해주세요";
  } else if (newProduct.name.length > 50) {
    newErrors.name = "상품명은 50자 이내로 입력해주세요";
  }

  // 가격 검증
  if (!newProduct.price) {
    newErrors.price = "가격을 입력해주세요";
  } else if (newProduct.price < 0) {
    newErrors.price = "가격은 0원 이상이어야 합니다";
  }

  // 재고 검증
  if (!newProduct.stock) {
    newErrors.stock = "재고를 입력해주세요";
  } else if (newProduct.stock < 0) {
    newErrors.stock = "재고는 0개 이상이어야 합니다";
  }

  return newErrors;
}

export default validateProduct;
