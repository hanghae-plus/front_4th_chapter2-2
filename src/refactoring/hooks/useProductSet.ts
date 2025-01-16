import { useState } from 'react';
import { getNewSet } from '../models/adminProduct.ts';

const useProductSet = () => {
  const [openProductIdList, setOpenProductIdList] = useState<Set<string>>(new Set());
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIdList((prevSet) => getNewSet(prevSet, productId));
  };

  return {
    openProductIdList,
    toggleProductAccordion,
  };
};

export default useProductSet;
