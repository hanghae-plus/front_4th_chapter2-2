import { useCallback, useMemo } from 'react';
import { Product } from '../../../../types';
import { useSort, SortOption } from '../../../hooks/useSort';

export type ProductSortType = 'name' | 'priceAsc' | 'priceDesc' | 'stockAsc' | 'stockDesc';

interface UseProductSortProps {
  products: Product[];
  getRemaining?: (product: Product) => number;
}

export const useProductSort = ({ products, getRemaining }: UseProductSortProps) => {
  const calculateStock = getRemaining || ((product: Product) => product.stock);

  const sortByStock = useCallback((a: Product, b: Product) => calculateStock(a) - calculateStock(b), [calculateStock]);

  const sortOptions: SortOption<Product>[] = useMemo(() => {
    const options: SortOption<Product>[] = [
      {
        value: 'name',
        label: '이름순',
        config: {
          key: 'name' as keyof Product,
          direction: 'asc',
        },
      },
      {
        value: 'priceAsc',
        label: '가격 낮은순',
        config: {
          key: 'price' as keyof Product,
          direction: 'asc',
        },
      },
      {
        value: 'priceDesc',
        label: '가격 높은순',
        config: {
          key: 'price' as keyof Product,
          direction: 'desc',
        },
      },
      {
        value: 'stockAsc',
        label: '재고 적은순',
        config: {
          key: 'custom',
          direction: 'asc',
          customSort: sortByStock,
        },
      },
      {
        value: 'stockDesc',
        label: '재고 많은순',
        config: {
          key: 'custom',
          direction: 'desc',
          customSort: sortByStock,
        },
      },
    ];
    return options;
  }, [sortByStock]);

  const { sortedItems, selectedSort, setSelectedSort } = useSort<Product>(products, sortOptions, 'name');

  return {
    sortedProducts: sortedItems,
    sortType: selectedSort,
    setSortType: setSelectedSort,
    sortOptions,
  };
};
