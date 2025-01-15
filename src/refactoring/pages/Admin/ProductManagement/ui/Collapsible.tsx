import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

const useCollapsible = (): CollapsibleContextType => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a CollapsibleProvider');
  }
  return context;
};

interface CollapsibleProviderProps {
  children: ReactNode;
}

const CollapsibleProvider = ({ children }: CollapsibleProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return <CollapsibleContext.Provider value={{ isOpen, toggle }}>{children}</CollapsibleContext.Provider>;
};

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const Collapsible = ({ children, ...props }: CollapsibleProps) => {
  return (
    <CollapsibleProvider>
      <div {...props}>{children}</div>
    </CollapsibleProvider>
  );
};

interface CollapsibleToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode | ((isOpen: boolean) => ReactNode);
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const CollapsibleToggle = ({ children, onClick, ...props }: CollapsibleToggleProps) => {
  const { isOpen, toggle } = useCollapsible();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    toggle();
  };

  return (
    <button onClick={handleClick} {...props}>
      {typeof children === 'function' ? children(isOpen) : children}
    </button>
  );
};
Collapsible.Toggle = CollapsibleToggle;

interface CollapsibleContentProps {
  children: ReactNode;
}
const CollapsibleContent = ({ children }: CollapsibleContentProps) => {
  const { isOpen } = useCollapsible();

  return isOpen ? <div>{children}</div> : null;
};

Collapsible.Content = CollapsibleContent;
