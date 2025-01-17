interface SectionProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Section = ({ className, title, children }: SectionProps) => {
  return (
    <div className={className}>
      {title}
      {children}
    </div>
  )
}
