import { usePreservedCallback } from './usePreservedCallback';

let fallbackStorage: Record<string, string> = {};

export const useLocalStorage = () => {
  const valid = checkLocalStorage();

  const setItem = usePreservedCallback((key: string, value: any) => {
    const string = typeof value === 'string' ? value : JSON.stringify(value);

    if (valid) {
      localStorage.setItem(key, string);
      return;
    }

    fallbackStorage[key] = string;
  });

  const getItem = usePreservedCallback((key: string) => {
    let value = valid ? localStorage.getItem(key) : fallbackStorage[key];

    if (!value) return null;

    try {
      return JSON.parse(value || '');
    } catch (error) {
      return value || null;
    }
  });

  const removeItem = usePreservedCallback((key: string) => {
    if (valid) {
      localStorage.removeItem(key);
      return;
    }

    delete fallbackStorage[key];
  });

  return {
    setItem,
    getItem,
    removeItem,
  };
};

// Utils
const checkLocalStorage = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
