import { useState } from 'react';

export const useToggleSet = (initialState: Set<string>) => {
  const [items, setItems] = useState<Set<string>>(initialState);

  const toggle = (item: string) => {
    setItems((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  return { items, toggle };
};
