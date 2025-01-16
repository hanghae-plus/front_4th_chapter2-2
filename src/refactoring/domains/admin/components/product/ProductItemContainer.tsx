import { useState } from 'react';

import type { ReactNode } from 'react';

interface ProductItemContainerProps {
  render: (
    openProductIds: Set<string>,
    showEditForm: boolean,
    toggleProductAccordion: (productId: string) => void,
    toggleEditForm: () => void,
  ) => ReactNode;
}

export const ProductItemContainer = ({ render }: ProductItemContainerProps) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleEditForm = () => {
    setShowEditForm((prev) => !prev);
  };

  return <>{render(openProductIds, showEditForm, toggleProductAccordion, toggleEditForm)}</>;
};
