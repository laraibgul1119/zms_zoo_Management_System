import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  textarea?: boolean;
}
export function Input({
  label,
  error,
  textarea = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const baseStyles = 'w-full border-4 border-black p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/50 transition-all';
  const errorStyles = error ? 'border-red-500 bg-red-50' : 'bg-white';
  return <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="block font-black text-black uppercase tracking-wide mb-2">
        {label}
      </label>

      {textarea ? <textarea id={inputId} className={`${baseStyles} ${errorStyles} min-h-[120px]`} {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} /> : <input id={inputId} className={`${baseStyles} ${errorStyles}`} {...props as React.InputHTMLAttributes<HTMLInputElement>} />}

      {error && <p className="mt-1 text-red-600 font-bold text-sm">{error}</p>}
    </div>;
}