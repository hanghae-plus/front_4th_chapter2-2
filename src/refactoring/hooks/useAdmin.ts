import { useState } from "react";

export const useAdmin = () => {
  // App 컴포넌트의 관심사는 아니므로 분리.
  const [isAdmin, setIsAdmin] = useState(false);

  const changeRole = () => {
    setIsAdmin(!isAdmin);
  };

  return {
    isAdmin,
    changeRole,
  };
};
