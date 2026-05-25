// core/modules/HR/components/EmployeeStatusBadge.tsx
import React from "react";
import type { EmployeeStatus } from "../../types/employee.types";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({
  status,
}) => {
  const config = {
    active: {
      label: "نشط",
      className: "bg-green-100 text-green-800",
      dotColor: "bg-green-500",
    },
    inactive: {
      label: "غير نشط",
      className: "bg-gray-100 text-gray-800",
      dotColor: "bg-gray-500",
    },
    onLeave: {
      label: "في إجازة",
      className: "bg-yellow-100 text-yellow-800",
      dotColor: "bg-yellow-500",
    },
  };

  const { label, className, dotColor } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {label}
    </span>
  );
};

export default EmployeeStatusBadge;
