
export type AttendanceStatus = "present" | "late" | "absent" | "onLeave" | "earlyLeave";

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  notes?: string;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
  late: number;
}

export const statusConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  present: { label: "Present", className: "bg-emerald-100 text-emerald-700" },
  late: { label: "Late", className: "bg-amber-100 text-amber-700" },
  absent: { label: "Absent", className: "bg-red-100 text-red-700" },
  onLeave: { label: "On Leave", className: "bg-blue-100 text-blue-700" },
  earlyLeave: { label: "Early Leave", className: "bg-purple-100 text-purple-700" },
};

export const calculateStats = (records: AttendanceRecord[]): AttendanceStats => {
  return {
    total: records.length,
    present: records.filter(r => r.status === "present").length,
    absent: records.filter(r => r.status === "absent").length,
    onLeave: records.filter(r => r.status === "onLeave").length,
    late: records.filter(r => r.status === "late").length,
  };
};