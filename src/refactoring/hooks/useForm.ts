import { useState } from 'react';

export const useForm = <T>(initialState: T) => {
  const [value, setValue] = useState<T>(initialState);

  const init = () => {
    setValue(initialState);
  };

  const updateValue = (key: keyof T, value: T[keyof T]) => {
    setValue(prev => ({ ...prev, [key]: value }));
  };

  return { value, updateValue, init };
};
