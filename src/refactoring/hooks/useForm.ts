import { useState } from 'react';

export const useForm = <T>(initialState: T) => {
  const [formState, setFormState] = useState(initialState);

  const enterFormHandler = <K extends keyof T>(key: K, value: T[K]) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };
  return {
    formState,
    resetForm,
    enterFormHandler
  };
};
