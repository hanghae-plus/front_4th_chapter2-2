import {CartItem, Discount, Product} from "../../types.ts";
import {useCallback, useEffect, useState} from "react";

/* 순수 함수 */
// 할인 정보 함수
export const discountInfo = (discount : Discount) => {
  return `${discount.quantity}개 이상 구매 시 ${discount.rate * 100}% 할인`
}

// 상품 입력 유효성 검사
type ValidationResult = {
  isValid: boolean;
  error?: string;
};

// 상품 등록 validation
export const validationProductData = (value:unknown, key: keyof Product) : ValidationResult => {
  switch (key) {
    case "id":
      if (typeof value !== "string") {
        return {isValue : false, error : "ID must be a string"}
      }
      if (value.length === 0) {
        return {isValid : false, error: "ID cannot be empty"};
      }
      return {isValid : true}
    
    case 'name':
      if (typeof value !== 'string') {
        return { isValid: false, error: 'Name must be a string' };
      }
      if (value.length === 0) {
        return { isValid: false, error: 'Name cannot be empty' };
      }
      return { isValid: true };
    
    case 'price':
      if (typeof value !== 'number') {
        return { isValid: false, error: 'Price must be a number' };
      }
      if (Number.isNaN(value)) {
        return { isValid: false, error: 'Price must be a number' };
      }
      if (value < 0) {
        return { isValid: false, error: 'Price cannot be negative' };
      }
      return { isValid: true };
    
    case 'stock':
      if (typeof value !== 'number') {
        return { isValid: false, error: 'Stock must be a number' };
      }
      if (!Number.isInteger(value)) {
        return { isValid: false, error: 'Stock must be an integer' };
      }
      if (value < 0) {
        return { isValid: false, error: 'Stock cannot be negative' };
      }
      return { isValid: true };
    
    case 'discounts':
      if (!Array.isArray(value)) {
        return { isValid: false, error: 'Discounts must be an array' };
      }
      // Here you can add additional validation for each discount object
      // depending on your Discount interface
      for (const discount of value) {
        // discount가 객체인지 확인
        if (typeof discount !== 'object' || discount === null) {
          return {
            isValid: false,
            error: 'Each discount must be an object'
          };
        }
        
        // quantity 검증
        if (typeof discount.quantity !== 'number') {
          return {
            isValid: false,
            error: 'Discount quantity must be a number'
          };
        }
        if (!Number.isInteger(discount.quantity) || discount.quantity <= 0) {
          return {
            isValid: false,
            error: 'Discount quantity must be a positive integer'
          };
        }
        
        // rate 검증
        if (typeof discount.rate !== 'number') {
          return {
            isValid: false,
            error: 'Discount rate must be a number'
          };
        }
        if (discount.rate <= 0 || discount.rate >= 100) {
          return {
            isValid: false,
            error: 'Discount rate must be between 0 and 100'
          };
        }
      }
      return { isValid: true };
    default:
      return { isValid: false, error: 'Invalid product key' };
  }
}

