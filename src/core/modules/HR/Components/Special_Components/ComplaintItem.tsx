// core/modules/HR/components/ComplaintItem.tsx
import React from "react";
import { AlertCircle } from "lucide-react";

interface ComplaintItemProps {
  employeeName: string;
  complaintType: string;
  date: string;
}

export const ComplaintItem: React.FC<ComplaintItemProps> = ({ 
  employeeName, 
  complaintType, 
  date 
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{employeeName}</p>
          <p className="text-xs text-gray-500">{complaintType}</p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{date}</span>
    </div>
  );
};

export default ComplaintItem;