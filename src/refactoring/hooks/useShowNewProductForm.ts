import { useState } from "react";

export const useShowNewProductForm = () => {
  // 컴포넌트는 데이터를 몰랐으면 좋겠다는 원칙에 따라 이런것까지 훅으로 뺸다.
  // showNewProductForm에 의해서 보일까말까가 결정되었으면 좋겠음 : 관심사 다른 거 맞는듯?
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const changeShowNewProductForm = (isShow: boolean) => {
    setShowNewProductForm(isShow);
  };
  return {
    showNewProductForm,
    changeShowNewProductForm,
  };
};
