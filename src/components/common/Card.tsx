import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-surface/50 backdrop-blur-lg border border-border rounded-lg ${className}`}
  >
    {children}
  </div>
);
