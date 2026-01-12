import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
}
export function Badge({
  children,
  variant = 'neutral'
}: BadgeProps) {
  const variants = {
    success: 'bg-[#10B981] text-black',
    warning: 'bg-[#FBBF24] text-black',
    danger: 'bg-[#F97316] text-white',
    neutral: 'bg-gray-200 text-black',
    info: 'bg-[#2563EB] text-white'
  };
  return <span className={`
      inline-flex items-center px-3 py-1 
      border-2 border-black font-bold text-sm uppercase tracking-wide
      ${variants[variant]}
    `}>
      {children}
    </span>;
}