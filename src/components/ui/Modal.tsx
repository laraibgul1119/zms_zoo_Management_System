import React from 'react';
import { X } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children
}: ModalProps) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-4 border-black w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#FBBF24]">
          <h3 className="text-xl font-black uppercase">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>;
}