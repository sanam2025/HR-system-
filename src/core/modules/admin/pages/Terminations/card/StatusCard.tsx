import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Termination } from "../../../types/types";

export const StatsCards = ({ data }: { data: Termination[] }) => {
  const total = data?.length || 0;
  const pending = data?.filter((t: any) => t.status === 'pending').length || 0;
  const approved = data?.filter((t: any) => t.status === 'approved').length || 0;
  const rejected = data?.filter((t: any) => t.status === 'rejected').length || 0;

  const stats = [
    { 
      title: "Total Terminations", 
      value: total, 
      icon: Users, 
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600"
    },
    { 
      title: "Pending Approval", 
      value: pending, 
      icon: Clock, 
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600"
    },
    { 
      title: "Approved", 
      value: approved, 
      icon: CheckCircle, 
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-600"
    },
    { 
      title: "Rejected", 
      value: rejected, 
      icon: XCircle, 
      color: "rose",
      bg: "bg-rose-50",
      text: "text-rose-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon className={`w-5 h-5 ${stat.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};