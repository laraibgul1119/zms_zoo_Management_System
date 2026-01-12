import React from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-black border-4 border-black transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-[#2563EB] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#1d4ed8]',
    secondary: 'bg-[#10B981] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#059669]',
    danger: 'bg-[#F97316] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ea580c]',
    outline: 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
  };
  const sizes = 'px-6 py-3 text-lg';
  const width = fullWidth ? 'w-full' : '';
  return <button className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`} disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>;
}