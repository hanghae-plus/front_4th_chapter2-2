import { useEffect, useRef } from 'react';

export const useEffectOnce = (callback: React.EffectCallback) => {
  const preserveCallback = useRef(callback).current;
  useEffect(preserveCallback, [preserveCallback]);
};
