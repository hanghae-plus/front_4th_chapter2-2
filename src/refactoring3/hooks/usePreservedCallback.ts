import { useCallback, useEffect, useRef } from "react";

export const usePreservedCallback = <Callback extends (...args: any[]) => any>(
  callback?: Callback
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: any[]) => callbackRef.current?.(...args),
    []
  ) as Callback;
};
