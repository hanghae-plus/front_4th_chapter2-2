import React from "react";

interface PageSectionProps {
  title: string;
  className?: string;
  UpperChild?: React.ReactNode;
  children: React.ReactNode;
}

const PageSection = ({
  title,
  className = "",
  UpperChild,
  children,
}: PageSectionProps) => {
  const pageSectionClassName = "space-y-2" + className;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {UpperChild}
      <div className={pageSectionClassName}>{children}</div>
    </div>
  );
};

export default PageSection;
