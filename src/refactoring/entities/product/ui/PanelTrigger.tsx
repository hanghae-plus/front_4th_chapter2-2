import { clsx } from 'clsx';

interface PanelTriggerProps {
  children: React.ReactNode;
  onToggle: () => void;
  className?: string;
  testId?: string;
  isDisabled?: boolean;
}

export function PanelTrigger({
  children,
  onToggle,
  testId = 'toggle-button',
  isDisabled = false,
  className = '',
}: PanelTriggerProps) {
  return (
    <button
      data-testid={testId}
      onClick={onToggle}
      disabled={isDisabled}
      className={clsx(
        'w-full text-left font-semibold',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}
