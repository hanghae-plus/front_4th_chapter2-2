import { useEffect, useState } from "react";
import { localStorageUtil } from "../utils";

export type EnvMode = "DEFAULT" | "LOCAL_STORAGE";

export const useStateByMode = <T>(key: string, initialValue: T) => {
  const envMode = process.env.REACT_APP_MODE as EnvMode;

  if (envMode === "LOCAL_STORAGE") {
    const [state, setState] = useState<T>(
      () => localStorageUtil.get<T>(key) ?? initialValue,
    );

    useEffect(() => {
      localStorageUtil.set<T>(key, state);
    }, [state]);

    return [state, setState] as const;
  }

  return useState(initialValue);
};
