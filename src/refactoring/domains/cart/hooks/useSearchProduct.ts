import { useMemo, useState } from 'react';

import { debounce } from '../../../utils/debounce';

import type { Product } from '../../../../types';

export const useSearchProduct = (products: Product[]) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = debounce((keyword: string) => {
    setKeyword(keyword);
  }, 300);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.includes(keyword));
  }, [keyword, products]);

  return { handleSearch, filteredProducts };
};
