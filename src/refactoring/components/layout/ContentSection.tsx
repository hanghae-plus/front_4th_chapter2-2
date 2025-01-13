import { ReactNode } from "react";

interface ContentSectionProps {
  children: ReactNode;
  subTitle: string;
}

const ContentSection = ({ children, subTitle }: ContentSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{subTitle}</h2>
      {children}
    </div>
  );
};

export default ContentSection;
