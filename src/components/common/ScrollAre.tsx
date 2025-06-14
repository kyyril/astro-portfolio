interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}
export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = "",
}) => <div className={`overflow-auto ${className}`}>{children}</div>;
