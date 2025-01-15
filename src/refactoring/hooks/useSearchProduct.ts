import {ChangeEvent, useMemo, useState} from "react";
import {Product} from "../../types.ts";
import {debounceCallback} from "../models/commonUtils.ts";

interface useSearchProductsProps {
  products : Product[];
}

export const useSearchProducts = ({products} : useSearchProductsProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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
  
  const func = debounceCallback((value) => {
    setSearchQuery(value)
  }, 300);
  
  const handleSearch = (event : ChangeEvent<HTMLInputElement>) : void => {
    const value = event.target.value;
    func(value)
    
  }
  
  return {
    searchQuery,
    filteredProducts,
    handleSearch
  }
}