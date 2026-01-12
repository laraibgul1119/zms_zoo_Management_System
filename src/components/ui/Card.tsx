import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}
export function Card({
  children,
  className = '',
  title,
  action
}: CardProps) {
  return <div className={`bg-white border-4 border-black p-6 md:p-8 ${className}`}>
      {(title || action) && <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black border-dashed">
          {title && <h2 className="text-2xl font-black uppercase tracking-tight">
              {title}
            </h2>}
          {action && <div>{action}</div>}
        </div>}
      {children}
    </div>;
}