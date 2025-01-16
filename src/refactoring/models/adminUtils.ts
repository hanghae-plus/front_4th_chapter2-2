import {CartItem, Discount, Product} from "../../types.ts";
import {useCallback, useEffect, useState} from "react";

/* 순수 함수 */
// 할인 정보를 리턴해주는 함수입니다.
export const discountInfo = (discount : Discount) => {
  return `${discount.quantity}개 이상 구매 시 ${discount.rate * 100}% 할인`
}

// 상품 입력 유효성 검사
type ValidationResult = {
  isValid: boolean;
  error?: string;
};

// 상품 등록 시 값의 타입과 범위를 지정한 validation 함수입니다.
export const validationProductData = (value:unknown, key: keyof Product) : ValidationResult => {
  switch (key) {
    case "id":
      if (typeof value !== "string") {
        return {isValue : false, error : "아이디는 문자열이어야 합니다."}
      }
      if (value.length === 0) {
        return {isValid : false, error: "아이디는 빈 값일 수 없습니다."};
      }
      return {isValid : true}
    
    case 'name':
      if (typeof value !== 'string') {
        return { isValid: false, error: '이름은 문자열이어야 합니다' };
      }
      if (value.length === 0) {
        return { isValid: false, error: '이름은 빈 값일 수 없습니다.' };
      }
      return { isValid: true };
    
    case 'price':
      if (typeof value !== 'number') {
        return { isValid: false, error: '가격은 숫자여야 합니다' };
      }
      if (Number.isNaN(value)) {
        return { isValid: false, error: '가격은 숫자여야 합니다' };
      }
      if (value < 0) {
        return { isValid: false, error: '가격은 음수일 수 없습니다.' };
      }
      return { isValid: true };
    
    case 'stock':
      if (typeof value !== 'number') {
        return { isValid: false, error: '재고는 숫자여야 합니다' };
      }
      if (!Number.isInteger(value)) {
        return { isValid: false, error: '재고는 0과 자연수여야합니다.' };
      }
      if (value < 0) {
        return { isValid: false, error: '재고는 음수일 수 없습니다.' };
      }
      return { isValid: true };
    
    case 'discounts':
      if (!Array.isArray(value)) {
        return { isValid: false, error: '할인 데이터를 배열이어야 합니다.' };
      }
      // Here you can add additional validation for each discount object
      // depending on your Discount interface
      for (const discount of value) {
        // discount가 객체인지 확인
        if (typeof discount !== 'object' || discount === null) {
          return {
            isValid: false,
            error: '할인 데이터는 객체입니다.'
          };
        }
        
        // quantity 검증
        if (typeof discount.quantity !== 'number') {
          return {
            isValid: false,
            error: '할인 개수는 숫자여야합니다.'
          };
        }
        if (!Number.isInteger(discount.quantity) || discount.quantity <= 0) {
          return {
            isValid: false,
            error: '할인율은 양의 정수여야합니다.'
          };
        }
        
        // rate 검증
        if (typeof discount.rate !== 'number') {
          return {
            isValid: false,
            error: '할인율은 숫자여야 합니다.'
          };
        }
        if (discount.rate <= 0 || discount.rate >= 100) {
          return {
            isValid: false,
            error: '할인율은 0 - 100 사이어야 합니다.'
          };
        }
      }
      return { isValid: true };
    default:
      return { isValid: false, error: 'Invalid product key' };
  }
}

