// core/modules/HR/pages/Attendance.tsx
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import AttendanceTableRow from "../Components/Special_Components/AttendanceTableRow";
import type {
  AttendanceRecord,
  AttendanceStats,
} from "../types/attendance.types";
import { calculateStats } from "../types/attendance.types";

// ============= Data (Static) - Organized by Date =============

const attendanceDataByDate: Record<string, AttendanceRecord[]> = {
  "2026-05-26": [
    {
      id: "1",
      employeeName: "Mohammed Al-Hassan",
      department: "Information Technology Engineering",
      checkInTime: "08:02",
      checkOutTime: "15:30",
      status: "late",
      lateMinutes: 2,
      notes: "2 min late",
    },
    {
      id: "2",
      employeeName: "Rana Al-Ali",
      department: "Basic Sciences",
      checkInTime: "08:45",
      checkOutTime: "15:00",
      status: "late",
      lateMinutes: 45,
      notes: "45 min late",
    },
    {
      id: "3",
      employeeName: "Wael Al-Masri",
      department: "Electrical Engineering",
      checkInTime: "07:55",
      checkOutTime: "15:30",
      status: "present",
    },
    {
      id: "4",
      employeeName: "Lama Al-Zoubi",
      department: "Administration and Planning",
      checkInTime: null,
      checkOutTime: null,
      status: "onLeave",
    },
    {
      id: "5",
      employeeName: "Karim Salman",
      department: "Student Affairs",
      checkInTime: "08:10",
      checkOutTime: "14:00",
      status: "earlyLeave",
      earlyLeaveMinutes: 90,
      notes: "90 min early leave",
    },
  ],
  "2026-05-25": [
    {
      id: "1",
      employeeName: "Mohammed Al-Hassan",
      department: "Information Technology Engineering",
      checkInTime: "08:30",
      checkOutTime: "15:30",
      status: "late",
      lateMinutes: 30,
      notes: "30 min late",
    },
    {
      id: "2",
      employeeName: "Rana Al-Ali",
      department: "Basic Sciences",
      checkInTime: "08:00",
      checkOutTime: "15:00",
      status: "present",
    },
    {
      id: "3",
      employeeName: "Wael Al-Masri",
      department: "Electrical Engineering",
      checkInTime: "07:55",
      checkOutTime: "15:30",
      status: "present",
    },
    {
      id: "4",
      employeeName: "Lama Al-Zoubi",
      department: "Administration and Planning",
      checkInTime: null,
      checkOutTime: null,
      status: "absent",
    },
    {
      id: "5",
      employeeName: "Karim Salman",
      department: "Student Affairs",
      checkInTime: "08:05",
      checkOutTime: "16:00",
      status: "present",
    },
  ],
  "2026-05-24": [
    {
      id: "1",
      employeeName: "Mohammed Al-Hassan",
      department: "Information Technology Engineering",
      checkInTime: "08:00",
      checkOutTime: "15:30",
      status: "present",
    },
    {
      id: "2",
      employeeName: "Rana Al-Ali",
      department: "Basic Sciences",
      checkInTime: "09:00",
      checkOutTime: "15:00",
      status: "late",
      lateMinutes: 60,
      notes: "60 min late",
    },
    {
      id: "3",
      employeeName: "Wael Al-Masri",
      department: "Electrical Engineering",
      checkInTime: "07:55",
      checkOutTime: "15:30",
      status: "present",
    },
    {
      id: "4",
      employeeName: "Lama Al-Zoubi",
      department: "Administration and Planning",
      checkInTime: null,
      checkOutTime: null,
      status: "onLeave",
    },
    {
      id: "5",
      employeeName: "Karim Salman",
      department: "Student Affairs",
      checkInTime: "08:00",
      checkOutTime: "16:00",
      status: "present",
    },
  ],
};

// Get available dates
const availableDates = Object.keys(attendanceDataByDate).sort().reverse();

// Format date for display
const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ============= Main Component =============

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]);

  const currentRecords: AttendanceRecord[] =
    attendanceDataByDate[selectedDate] || [];
  const stats: AttendanceStats = calculateStats(currentRecords);

  const handleView = (record: AttendanceRecord) => {
    console.log("View record:", record);
  };

  const handleEdit = (record: AttendanceRecord) => {
    console.log("Edit record:", record);
  };

  const goToPreviousDay = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  };

  const goToNextDay = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header with Date Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Daily Attendance Report
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Track employee check-in, check-out, and attendance status.
            </p>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
            <button
              onClick={goToPreviousDay}
              disabled={
                selectedDate === availableDates[availableDates.length - 1]
              }
              className={`p-2 rounded-lg transition-colors ${
                selectedDate === availableDates[availableDates.length - 1]
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>

            <button
              onClick={goToNextDay}
              disabled={selectedDate === availableDates[0]}
              className={`p-2 rounded-lg transition-colors ${
                selectedDate === availableDates[0]
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon={<UserX className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          title="Present"
          value={stats.present}
          icon={<UserCheck className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Total"
          value={stats.total}
          icon={<Users className="w-5 h-5" />}
          color="teal"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Check In
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentRecords.map((record) => (
                <AttendanceTableRow
                  key={record.id}
                  record={record}
                  onView={handleView}
                  onEdit={handleEdit}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentRecords.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              No attendance records found for this date
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
