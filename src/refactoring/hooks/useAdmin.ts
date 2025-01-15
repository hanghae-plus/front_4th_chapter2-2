import { useState } from "react";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false); // 흠... 고민이군.

  const handleChangeRole = () => {
    setIsAdmin(!isAdmin);
  };

  return {
    isAdmin,
    handleChangeRole,
  };
};
