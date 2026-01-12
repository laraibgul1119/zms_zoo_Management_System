import React from 'react';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  label: string;
  value: string | number;
  icon: BoxIcon;
  color: string;
  trend?: string;
}
export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend
}: StatCardProps) {
  return <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 border-2 border-black" style={{
        backgroundColor: color
      }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && <span className="font-bold text-sm bg-green-100 text-green-800 px-2 py-1 border-2 border-black">
            {trend}
          </span>}
      </div>
      <div className="text-4xl font-black mb-1">{value}</div>
      <div className="text-gray-600 font-bold uppercase tracking-wide text-sm">
        {label}
      </div>
    </div>;
}