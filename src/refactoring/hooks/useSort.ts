import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | 'custom';
  direction: SortDirection;
  customSort?: (a: T, b: T) => number;
}

export interface SortOption<T> {
  value: string;
  label: string;
  config: SortConfig<T>;
}

export const useSort = <T extends object>(items: T[], options: SortOption<T>[], defaultSort: string) => {
  const [selectedSort, setSelectedSort] = useState(defaultSort);

  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];
    const currentOption = options.find((opt) => opt.value === selectedSort);

    if (!currentOption) return itemsCopy;

    const { key, direction, customSort } = currentOption.config;

    return itemsCopy.sort((a, b) => {
      let result: number;

      if (key === 'custom' && customSort) {
        result = customSort(a, b);
      } else {
        const aValue = a[key as keyof T];
        const bValue = b[key as keyof T];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = aValue.localeCompare(bValue);
        } else {
          result = (aValue as number) - (bValue as number);
        }
      }

      return direction === 'asc' ? result : -result;
    });
  }, [items, selectedSort, options]);

  return {
    sortedItems,
    selectedSort,
    setSelectedSort,
    options,
  };
};
