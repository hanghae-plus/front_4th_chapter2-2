import { useState } from 'react';

export const useAdminState = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdminState = () => {
    setIsAdmin(prev => !prev);
  };

  return { isAdmin, toggleAdminState };
};
