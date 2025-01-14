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

  const getSnapshot = useCallback(() => externalStore.current.get(key, initialValue), [key, initialValue]);

  const value = useSyncExternalStore(externalStore.current.subscribe.bind(externalStore.current), getSnapshot);

  const setValue = useCallback(
    (newValue: SetStateAction<T>) => {
      try {
        const prevValue = externalStore.current.get(key, initialValue);
        externalStore.current.set(
          key,
          JSON.stringify(newValue instanceof Function ? newValue(JSON.parse(prevValue) as T) : newValue),
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue],
  );

  return [JSON.parse(value) as T, setValue] as const;
};
