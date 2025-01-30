import React from "react";

interface PageContainerProps {
  pageTitle: string;
  children: React.ReactNode;
}

const PageContainer = ({ pageTitle, children }: PageContainerProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

export default PageContainer;
