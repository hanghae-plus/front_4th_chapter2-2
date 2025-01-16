import { useMemo, useState } from 'react';

import { debounce } from '../../../utils/debounce';

import type { Product } from '../../../../types';

const SEARCH_DELAY_MS = 300;

export const useSearchProduct = (products: Product[]) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = debounce((keyword: string) => {
    setKeyword(keyword);
  }, SEARCH_DELAY_MS);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.includes(keyword));
  }, [keyword, products]);

  return { handleSearch, filteredProducts };
};
