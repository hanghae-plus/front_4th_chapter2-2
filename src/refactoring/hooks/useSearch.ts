import { useEffect, useState } from 'react';

export const useSearch = <T>(items: T[], searchKeys: Extract<keyof T, string>[]) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>(items);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(items);

      return;
    }

    const filteredItems = items.filter((item) =>
      searchKeys.some((key) => {
        const value = (item as Record<typeof key, unknown>)[key];

        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(query.toLowerCase());
      })
    );

    setSearchResults(filteredItems);
  }, [items, query, searchKeys]);

  return {
    query,
    setQuery,
    searchResults,
  };
};
