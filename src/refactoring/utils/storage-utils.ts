export function getLocalStorageItem<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`localStorage 읽기 오류:`, error);
    return initialValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`localStorage 설정 오류:`, error);
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`localStorage 제거 오류:`, error);
  }
}
