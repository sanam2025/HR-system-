// core/modules/HR/components/LeaveRequestItem.tsx
import React from "react";
import { Clock } from "lucide-react";

interface LeaveRequestItemProps {
  name: string;
  title: string;
  department: string;
}

export const LeaveRequestItem: React.FC<LeaveRequestItemProps> = ({ 
  name, 
  title, 
  department 
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{department}</p>
        </div>
      </div>
      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
        معلقة
      </span>
    </div>
  );
};

export default LeaveRequestItem;