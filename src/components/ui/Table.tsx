import React from 'react';
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  actions?: (item: T) => React.ReactNode;
}
export function Table<T>({
  data,
  columns,
  keyField,
  actions
}: TableProps<T>) {
  return <div className="overflow-x-auto border-4 border-black">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black text-white">
            {columns.map((col, index) => <th key={index} className={`p-4 font-black uppercase tracking-wider border-r-4 border-white last:border-r-0 ${col.className || ''}`}>
                {col.header}
              </th>)}
            {actions && <th className="p-4 font-black uppercase tracking-wider text-right">
                Actions
              </th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => <tr key={String(item[keyField])} className={`
                border-b-4 border-black last:border-b-0 
                ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                hover:bg-[#FBBF24]/10 transition-colors
              `}>
              {columns.map((col, colIndex) => <td key={colIndex} className="p-4 border-r-4 border-black last:border-r-0 font-medium">
                  {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor] as React.ReactNode}
                </td>)}
              {actions && <td className="p-4 text-right">{actions(item)}</td>}
            </tr>)}
          {data.length === 0 && <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center font-bold text-gray-500">
                No records found
              </td>
            </tr>}
        </tbody>
      </table>
    </div>;
}