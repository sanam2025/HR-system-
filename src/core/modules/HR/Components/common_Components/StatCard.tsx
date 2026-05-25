// shared/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'gray' | 'red' | 'purple';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-100 text-blue-600',
    green: 'border-green-500 bg-green-100 text-green-600',
    yellow: 'border-yellow-500 bg-yellow-100 text-yellow-600',
    gray: 'border-gray-500 bg-gray-100 text-gray-600',
    red: 'border-red-500 bg-red-100 text-red-600',
    purple: 'border-purple-500 bg-purple-100 text-purple-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-r-4 ${colorClasses[color].split(' ')[0]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`${colorClasses[color].split(' ')[1]} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;