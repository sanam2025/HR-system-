import { type CurrentPayroll, type AttendancePrecentage, type Payrolls } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithData, APIResponseWithOnlyDataArray } from "../../Types/types.types";

export const OverviewService = {
    getPrecentageAttendance: () => apiClient.get<AttendancePrecentage>('attendance-percentage'),
    getAllPayroll: () => apiClient.get<APIResponseWithOnlyDataArray<Payrolls>>('payrolls'),
    getCurrentPayroll: () => apiClient.get<APIResponseWithData<CurrentPayroll>>('payroll/current'),

    generatePayroll: () => apiClient.post('payroll/generate')
}