// core/modules/HR/components/QuickActionButton.tsx
import React from "react";
import { ChevronLeft } from "lucide-react";

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  label, 
  icon, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-600">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
        <ChevronLeft className="w-5 h-5" />
      </span>
    </button>
  );
};

export default QuickActionButton;