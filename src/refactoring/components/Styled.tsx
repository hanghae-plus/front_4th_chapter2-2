import { ReactNode } from 'react';

const styled = (El: keyof JSX.IntrinsicElements, cn?: string) => {
  return ({ children }: { children: ReactNode }) => <El className={cn}>{children}</El>;
}

export const Title = Object.assign({}, {
  Main: styled('h2', 'text-3xl font-bold mb-6'),
  Sub: styled('h2', 'text-2xl font-semibold mb-4'),
  Container: styled('h2', 'text-2xl font-semibold mb-2'),
});

export const Container = Object.assign(styled('div', 'space-y-2'), {
  Grid: styled('div', 'grid grid-cols-1 md:grid-cols-2 gap-6')
});
