import React from 'react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  error?: string;
}
export function Select({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return <div className={`mb-4 ${className}`}>
      <label htmlFor={selectId} className="block font-black text-black uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className="relative">
        <select id={selectId} className={`
            w-full border-4 border-black p-3 font-bold text-lg appearance-none bg-white
            focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/50 transition-all
            ${error ? 'border-red-500 bg-red-50' : ''}
          `} {...props}>
          {options.map(opt => <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-red-600 font-bold text-sm">{error}</p>}
    </div>;
}