import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
  disabled = false,
  className = "",
}) => (
  <input
    type="text"
    className={`flex h-10 w-full rounded-md border border-border bg-surface/30 backdrop-blur-sm px-3 py-2 text-sm text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    onKeyDown={onKeyDown}
    disabled={disabled}
  />
);
