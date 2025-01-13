export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
};
