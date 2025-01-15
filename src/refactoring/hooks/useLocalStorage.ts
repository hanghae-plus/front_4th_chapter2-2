import { useCallback, useRef, useSyncExternalStore } from 'react';

type SetStateAction<T> = T | ((prevState: T) => T);

export class LocalStorageStore {
  private static instance: LocalStorageStore;

  private listeners: (() => void)[] = [];

  static getInstance() {
    if (!LocalStorageStore.instance) {
      LocalStorageStore.instance = new LocalStorageStore();
    }
    return LocalStorageStore.instance;
  }

  get clientSideSnapshot() {
    return LocalStorageStore.getInstance();
  }
  public subscribe(listener: () => void) {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  get<T>(name: string, initialValue: T): string {
    const value = window.localStorage.getItem(name);

    if (!value) return JSON.stringify(initialValue);

    return value;
  }

  set(name: string, value: string) {
    window.localStorage.setItem(name, value);
    this.notify();
  }

  remove(name: string) {
    window.localStorage.removeItem(name);
    this.notify();
  }
}

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const externalStore = useRef(LocalStorageStore.getInstance());

  const getSnapshot = useCallback(() => {
    try {
      return externalStore.current.get(key, initialValue);
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  const value = useSyncExternalStore(externalStore.current.subscribe.bind(externalStore.current), getSnapshot);

  const setValue = useCallback(
    (newValue: SetStateAction<T>) => {
      try {
        const prevValue = externalStore.current.get(key, initialValue);
        const nextValue = newValue instanceof Function ? newValue(JSON.parse(prevValue) as T) : newValue;
        externalStore.current.set(key, JSON.stringify(nextValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue],
  );

  try {
    return [JSON.parse(value) as T, setValue] as const;
  } catch (error) {
    console.error(`Error parsing localStorage value for key "${key}":`, error);
    return [initialValue, setValue] as const;
  }
};
