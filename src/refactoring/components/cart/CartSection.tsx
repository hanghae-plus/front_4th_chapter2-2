import React from "react";

interface ContainerProps {
  title: string;
  children: React.ReactNode;
}

const CartSection = ({ title, children }: ContainerProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default CartSection;
