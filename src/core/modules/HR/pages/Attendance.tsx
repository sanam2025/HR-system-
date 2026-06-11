// core/modules/HR/pages/Attendance.tsx
import React, { useState } from "react";
import { Calendar, Clock, UserCheck, UserX, Users, ChevronLeft, ChevronRight } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import AttendanceTableRow from "../Components/Special_Components/AttendanceTableRow";
import type { AttendanceRecord, AttendanceStats } from "../types/attendance.types";
import { calculateStats } from "../types/attendance.types";

// ============= DATA =============
type AttendanceData = Record<string, AttendanceRecord[]>;

const DATA: AttendanceData = {
  "2026-05-26": [
    { id: "1", employeeName: "Mohammed Al-Hassan", department: "Information Technology Engineering", checkInTime: "08:02", checkOutTime: "15:30", status: "late", lateMinutes: 2, notes: "2 min late" },
    { id: "2", employeeName: "Rana Al-Ali", department: "Basic Sciences", checkInTime: "08:45", checkOutTime: "15:00", status: "late", lateMinutes: 45, notes: "45 min late" },
    { id: "3", employeeName: "Wael Al-Masri", department: "Electrical Engineering", checkInTime: "07:55", checkOutTime: "15:30", status: "present" },
    { id: "4", employeeName: "Lama Al-Zoubi", department: "Administration and Planning", checkInTime: null, checkOutTime: null, status: "onLeave" },
    { id: "5", employeeName: "Karim Salman", department: "Student Affairs", checkInTime: "08:10", checkOutTime: "14:00", status: "earlyLeave", earlyLeaveMinutes: 90, notes: "90 min early leave" },
  ],
  "2026-05-25": [
    { id: "1", employeeName: "Mohammed Al-Hassan", department: "Information Technology Engineering", checkInTime: "08:30", checkOutTime: "15:30", status: "late", lateMinutes: 30, notes: "30 min late" },
    { id: "2", employeeName: "Rana Al-Ali", department: "Basic Sciences", checkInTime: "08:00", checkOutTime: "15:00", status: "present" },
    { id: "3", employeeName: "Wael Al-Masri", department: "Electrical Engineering", checkInTime: "07:55", checkOutTime: "15:30", status: "present" },
    { id: "4", employeeName: "Lama Al-Zoubi", department: "Administration and Planning", checkInTime: null, checkOutTime: null, status: "absent" },
    { id: "5", employeeName: "Karim Salman", department: "Student Affairs", checkInTime: "08:05", checkOutTime: "16:00", status: "present" },
  ],
  "2026-05-24": [
    { id: "1", employeeName: "Mohammed Al-Hassan", department: "Information Technology Engineering", checkInTime: "08:00", checkOutTime: "15:30", status: "present" },
    { id: "2", employeeName: "Rana Al-Ali", department: "Basic Sciences", checkInTime: "09:00", checkOutTime: "15:00", status: "late", lateMinutes: 60, notes: "60 min late" },
    { id: "3", employeeName: "Wael Al-Masri", department: "Electrical Engineering", checkInTime: "07:55", checkOutTime: "15:30", status: "present" },
    { id: "4", employeeName: "Lama Al-Zoubi", department: "Administration and Planning", checkInTime: null, checkOutTime: null, status: "onLeave" },
    { id: "5", employeeName: "Karim Salman", department: "Student Affairs", checkInTime: "08:00", checkOutTime: "16:00", status: "present" },
  ],
};

const DATES = Object.keys(DATA).sort().reverse();

const STATS_CONFIG: Array<{ key: keyof AttendanceStats; title: string; icon: React.ElementType; color: "blue" | "green" | "orange" | "red" | "teal" }> = [
  { key: "onLeave", title: "On Leave", icon: Calendar, color: "blue" },
  { key: "absent", title: "Absent", icon: UserX, color: "red" },
  { key: "present", title: "Present", icon: UserCheck, color: "green" },
  { key: "total", title: "Total", icon: Users, color: "teal" },
];

const COLUMNS: string[] = ["Employee", "Department", "Check In", "Check Out", "Status", "Notes", "Actions"];

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

// ============= COMPONENTS =============
interface DateNavProps {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const DateNav: React.FC<DateNavProps> = ({ date, onPrev, onNext, isFirst, isLast }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-1.5">
    <button onClick={onPrev} disabled={isLast} className={`p-2 rounded-lg ${isLast ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}>
      <ChevronLeft className="w-5 h-5" />
    </button>
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
      <Calendar className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium">{formatDate(date)}</span>
    </div>
    <button onClick={onNext} disabled={isFirst} className={`p-2 rounded-lg ${isFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}>
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

interface StatsGridProps {
  stats: AttendanceStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    {STATS_CONFIG.map(({ key, title, icon: Icon, color }) => (
      <StatCard key={key} title={title} value={stats[key]} icon={<Icon className="w-5 h-5" />} color={color} />
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
    <p className="text-sm text-gray-400">No attendance records found</p>
  </div>
);

// ============= MAIN =============
export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);
  const currentRecords: AttendanceRecord[] = DATA[selectedDate] || [];
  const stats: AttendanceStats = calculateStats(currentRecords);
  const currentIndex = DATES.indexOf(selectedDate);

  const handleView = (record: AttendanceRecord) => console.log("View record:", record);
  const handleEdit = (record: AttendanceRecord) => console.log("Edit record:", record);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daily Attendance Report</h1>
          <p className="text-gray-500 text-sm mt-1">Track employee check-in, check-out, and attendance status.</p>
        </div>
        <DateNav
          date={selectedDate}
          onPrev={() => setSelectedDate(DATES[currentIndex + 1])}
          onNext={() => setSelectedDate(DATES[currentIndex - 1])}
          isFirst={currentIndex === 0}
          isLast={currentIndex === DATES.length - 1}
        />
      </div>

      <StatsGrid stats={stats} />

      {/* Attendance Table - بدون border */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <AttendanceTableRow key={record.id} record={record} onView={handleView} onEdit={handleEdit} />
              ))}
            </tbody>
          </table>
        </div>
        {currentRecords.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}