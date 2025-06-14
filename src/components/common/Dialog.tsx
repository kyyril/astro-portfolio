interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 bg-surface/90 backdrop-blur-lg rounded-lg border border-border p-6 shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};
