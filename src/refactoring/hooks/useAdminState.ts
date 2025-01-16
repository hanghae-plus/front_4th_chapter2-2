import { useState } from "react";

const useAdminState = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdminState = () => {
    setIsAdmin((prev) => !prev);
  };

  return { isAdmin, toggleAdminState };
};

export default useAdminState;
