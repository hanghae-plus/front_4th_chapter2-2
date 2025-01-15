import { useEffect, useState } from "react";
import { localStorageUtil } from "../utils";
import { apiUtil } from "../utils/apiUtil";

export type EnvMode = "DEFAULT" | "LOCAL_STORAGE" | "API_MOCK";

export const useStateByMode = <T>(
  key: string,
  api: string,
  initialValue: T,
) => {
  const envMode = process.env.REACT_APP_MODE as EnvMode;

  if (envMode === "LOCAL_STORAGE") {
    const [state, setState] = useState<T>(
      () => localStorageUtil.get<T>(key) ?? initialValue,
    );

    const updateState = async (updater: (prevState: T) => T) => {
      localStorageUtil.set<T>(key, updater(state));
      const updatedState = localStorageUtil.get<T>(key);

      if (!updatedState) {
        throw Error("Updated state is not found.");
      }

      setState(updatedState);
    };

    return [state, updateState] as const;
  }

  if (envMode === "API_MOCK") {
    const [state, setState] = useState<T>(() => initialValue);

    useEffect(() => {
      initState(api);
    }, []);

    const initState = async (api: string) => {
      const data = await apiUtil.get<T>(api);
      setState(data);
    };

    const updateState = async (updater: (prevState: T) => T) => {
      const updatedState = await apiUtil.put<T>(api, updater(state));
      setState(updatedState);
    };

    return [state, updateState] as const;
  }

  return useState(initialValue);
};
