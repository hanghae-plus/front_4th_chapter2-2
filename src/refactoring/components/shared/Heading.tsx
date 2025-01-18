import { createElement } from 'react';

interface HeadingProps extends React.ComponentProps<'h1'> {
  as: 'h1' | 'h2' | 'h3' | 'h4';
}

export function Heading({ as, ...props }: HeadingProps) {
  return createElement(as, props);
}
