import React, { useState } from "react";
import { 
  Award, 
  Users, 
  Star, 
  TrendingUp, 
  User,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

import type { Employee } from "../../../../../api/Types/types.types";

export type TopRate = {
  year: number;
  quarter: number;
  employees: Employee[];
};

type TopEmployeesSectionProps = {
  topRate?: {
    data: TopRate;
  };
  isLoadingTopRate: boolean;
};


const TopEmployeeCard = ({ employee }: { employee: Employee & { rating?: number; projects_completed?: number; attendance_rate?: number } }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return "text-emerald-500";
    if (rating >= 4.5) return "text-blue-500";
    if (rating >= 4.0) return "text-amber-500";
    return "text-gray-500";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const getGreenShade = (name: string) => {
    const greens = [
      "bg-emerald-500",
      "bg-green-500", 
      "bg-teal-500",
      "bg-emerald-600",
      "bg-green-600",
      "bg-teal-600",
      "bg-emerald-400",
      "bg-green-400"
    ];
    const index = name.length % greens.length;
    return greens[index];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full ${getGreenShade(employee.name)} flex items-center justify-center`}>
            <span className="text-white font-semibold text-sm">
              {getInitials(employee.name)}
            </span>
          </div>
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">{employee.name}</h4>
          <p className="text-xs text-gray-500">{employee.job_title || 'No Position'}</p>
          <p className="text-xs text-gray-400">{employee.department}</p>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${getRatingColor(employee.rating || 0)}`}>
            {(employee.rating || 0).toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{employee.projects_completed || 0} projects</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <User className="w-3.5 h-3.5" />
            <span>{employee.attendance_rate || 0}% attendance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function TopEmployeesSection({ topRate, isLoadingTopRate }: TopEmployeesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const employees = topRate?.data?.employees || [];
  const hasEmployees = employees.length > 0;

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  if (!hasEmployees && !isLoadingTopRate) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-800">Top Rated Employees</h2>
          <span className="text-xs text-gray-400">(0)</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-gray-50 rounded-full p-4">
              <Users className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No Top Rated Employees</h3>
            <p className="text-sm text-gray-500 max-w-md">
              No employees have been rated yet. Ratings will appear here once employees receive their performance reviews.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-800">Top Rated Employees</h2>
        <span className="text-xs text-gray-400">({employees.length})</span>
        {topRate?.data?.year && (
          <span className="text-xs text-gray-400">
            • Q{topRate.data.quarter} {topRate.data.year}
          </span>
        )}
      </div>

      {isLoadingTopRate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-200 rounded w-8"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 mt-1"></div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentEmployees.map((employee: any) => (
              <TopEmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TopEmployeesSection;