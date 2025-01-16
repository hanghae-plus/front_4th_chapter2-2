import { useCallback, useState } from 'react';

export const useAccordion = () => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleAccordion = useCallback((id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return {
    openIds,
    toggleAccordion,
  };
};
