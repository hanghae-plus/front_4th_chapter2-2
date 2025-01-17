import { ReactNode } from 'react';

const styled = (El: keyof JSX.IntrinsicElements, cn?: string) => {
  return ({ children, ...props }: { [x: string]: unknown; children: ReactNode }) => <El {...props} className={cn}>{children}</El>;
}

export const Title = Object.assign({}, {
  Main: styled('h2', 'text-3xl font-bold mb-6'),
  Sub: styled('h2', 'text-2xl font-semibold mb-4'),
  Container: styled('h2', 'text-2xl font-semibold mb-2'),
});

export const Container = Object.assign(styled('div', 'space-y-2'), {
  Grid: styled('div', 'grid grid-cols-1 md:grid-cols-2 gap-6')
});

export const Button = Object.assign({}, {
  Red: styled('button', 'bg-red-500 text-white rounded hover:bg-red-600'),
  Green: styled('button', 'bg-green-500 text-white rounded hover:bg-green-600'),
  Blue: styled('button', 'bg-blue-500 text-white p-2 rounded hover:bg-blue-600'),
  FullLeftText: styled('button', 'w-full text-left font-semibold'),
});