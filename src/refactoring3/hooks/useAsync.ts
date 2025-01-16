import { useState } from 'react';
import { useEffectOnce } from './useEffectOnce';
import { usePreservedCallback } from './usePreservedCallback';

interface AsyncState<TData> {
  data: TData | null;
  error: Error | null;
  idling: boolean;
  loading: boolean;
  succeed: boolean;
  failed: boolean;
}

const handlers = {
  initial<TData>(initialData: TData | null = null): AsyncState<TData> {
    return {
      data: initialData,
      error: null,
      idling: true,
      loading: false,
      succeed: false,
      failed: false,
    };
  },

  load<TData>(initialData: TData | null = null): AsyncState<TData> {
    return {
      data: initialData,
      error: null,
      idling: false,
      loading: true,
      succeed: false,
      failed: false,
    };
  },

  success<TData>(data: TData): AsyncState<TData> {
    return {
      data,
      error: null,
      idling: false,
      loading: false,
      succeed: true,
      failed: false,
    };
  },

  error<TData>(error: Error): AsyncState<TData> {
    return {
      error,
      data: null,
      idling: false,
      loading: false,
      succeed: false,
      failed: false,
    };
  },
};

interface Options<TData extends any> {
  initialData?: TData;
  asyncFn: () => Promise<TData>;
}

export const useAsync = <TData = any>({ initialData, asyncFn: _asyncFn }: Options<TData>) => {
  const [asyncState, setAsyncState] = useState<AsyncState<TData>>(() =>
    handlers.initial(initialData),
  );
  const asyncFn = usePreservedCallback(_asyncFn);

  const run = usePreservedCallback(() => {
    setAsyncState(handlers.load(initialData));

    Promise.resolve()
      .then(asyncFn)
      .then((data) => setAsyncState(handlers.success(data)))
      .catch((error) => {
        const httpError = new Error();
        httpError.name = 'HTTP Error';
        httpError.message = error.message;

        setAsyncState(handlers.error(httpError));
      });
  });

  useEffectOnce(() => {
    run();
    return () => setAsyncState(handlers.initial(initialData));
  });

  return {
    data: asyncState.data,
    error: asyncState.error,
    idling: asyncState.idling,
    loading: asyncState.loading,
    succeed: asyncState.succeed,
    failed: asyncState.failed,
    reRun: run,
  };
};
