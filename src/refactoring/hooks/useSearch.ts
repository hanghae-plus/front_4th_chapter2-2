import { useState, useMemo } from 'react';

export const useSearch = <T>(items: T[], searchKeys: Extract<keyof T, string>[]) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return items;
    }

    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = (item as Record<typeof key, unknown>)[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query.toLowerCase());
      })
    );
  }, [items, query, searchKeys]);

  return {
    query,
    setQuery,
    searchResults,
  };
};
