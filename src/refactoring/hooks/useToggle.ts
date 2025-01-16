import { useState } from 'react';

export const useToggle = (initialState: boolean) => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = () => {
    setState((prev: boolean) => !prev);
  };

  const onClose = () => {
    setState(false);
  };

  const onOpen = () => {
    setState(true);
  };

  return { state, toggle, onOpen, onClose };
};
