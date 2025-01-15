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

interface CollapsibleProps {
  children: ReactNode;
}
export const Collapsible = ({ children }: CollapsibleProps) => {
  return <CollapsibleProvider>{children}</CollapsibleProvider>;
};

interface CollapsibleToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
const CollapsibleToggle = ({ children, ...props }: CollapsibleToggleProps) => {
  const { toggle } = useCollapsible();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggle();
    props.onClick?.(e);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
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
