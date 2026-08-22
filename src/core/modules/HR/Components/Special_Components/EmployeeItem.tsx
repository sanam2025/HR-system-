import React from "react";
import { Users } from "lucide-react";

interface EmployeeItemProps {
  name: string;
  title: string;
  department: string;
  status: "active" | "onLeave" | "inactive";
}

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  onLeave: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-700",
};

const statusText = {
  active: "نشط",
  onLeave: "في إجازة",
  inactive: "غير نشط",
};

export const EmployeeItem: React.FC<EmployeeItemProps> = ({ 
  name, 
  title, 
  department, 
  status 
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{department}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
        {statusText[status]}
      </span>
    </div>
  );
};

export default EmployeeItem;