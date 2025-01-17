import { useState } from 'react';

export const useToggleSet = () => {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const toggleItemAccordion = (id: string) => {
    setActiveIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return { toggleItemAccordion, activeIds };
};
