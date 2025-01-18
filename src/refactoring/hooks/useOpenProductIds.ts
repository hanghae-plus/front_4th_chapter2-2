import { useState } from "react";
import { toggleProductInSet } from "../models/product";

export const useOpenProductIds = () => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => toggleProductInSet(prev, productId));
  };

  return {
    openProductIds,
    toggleProductAccordion,
  };
};
