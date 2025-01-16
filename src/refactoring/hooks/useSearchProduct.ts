import {ChangeEvent, useMemo, useState} from "react";
import {Product} from "../../types.ts";
import {debounceCallback} from "../models/commonUtils.ts";

interface useSearchProductsProps {
  products : Product[];
}

// 상품 검색을 관할하는 훅입니다.
export const useSearchProducts = ({products} : useSearchProductsProps) => {
  // 타이핑한 검색 키워드
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 타이핑한 키워드에 따라 나타난 검색 결과를 담고있는 변수
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    
    return products.filter(product => {
      const name = product.name.toLowerCase();
      const price = product.price.toString();
      
      // 상품명 또는 가격으로 검색
      return name.includes(query) || price.includes(query);
    });
  }, [searchQuery, products])
  
  // 검색을 할 때 debounce 처리를 도와주는 함수
  const searchDebounce = debounceCallback((value) => {
    setSearchQuery(value)
  }, 300);
  
  // 검색 타이핑을 할 때 onChange를 받을 함수
  const handleSearch = (event : ChangeEvent<HTMLInputElement>) : void => {
    const value = event.target.value;
    searchDebounce(value)
    
  }
  
  return {
    searchQuery,
    filteredProducts,
    handleSearch
  }
}