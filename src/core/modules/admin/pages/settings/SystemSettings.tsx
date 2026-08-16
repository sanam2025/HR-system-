import React, { useState } from "react";
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Database,
  Briefcase,
  Gavel,
  Edit,
  AlertCircle,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useSettings } from "../../hooks/Settings/useSettings";
import { useUpdateSettings } from "../../hooks/Settings/useSettingsMutation";
import { formatTimeSettings, formatWeekendDays } from "../../util/utils";
import { SettingsSkeleton } from "./Skeleton";
import toast from "react-hot-toast";

type EditingState = {
  workingHours: boolean;
  leaveSettings: boolean;
  termination: boolean;
  weekend: boolean;
  legal: boolean;
  currency: boolean;
};

export default function Settings() {
  const { data: settingsData, isLoading, refetch } = useSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateSettings();
  const settings = settingsData?.data;

  const [editing, setEditing] = useState<EditingState>({
    workingHours: false,
    leaveSettings: false,
    termination: false,
    weekend: false,
    legal: false,
    currency: false,
  });

  const [formData, setFormData] = useState({
    expected_check_in: "",
    expected_check_out: "",
    grace_period: 0,
    annual_leave_days: 0,
    sick_leave_days: 0,
    probation_period_days: 0,
    termination_notice_days: 0,
    weekend_days: [] as string[],
    jurisdiction: "",
    currency: "",
  });

  const startEditing = (section: keyof EditingState) => {
    if (settings) {
      setFormData({
        expected_check_in: settings.expected_check_in || "",
        expected_check_out: settings.expected_check_out || "",
        grace_period: settings.grace_period || 0,
        annual_leave_days: settings.annual_leave_days || 0,
        sick_leave_days: settings.sick_leave_days || 0,
        probation_period_days: settings.probation_period_days || 0,
        termination_notice_days: settings.termination_notice_days || 0,
        weekend_days: settings.weekend_days || [],
        jurisdiction: settings.jurisdiction || "",
        currency: settings.currency || "",
      });
    }
    setEditing({ ...editing, [section]: true });
  };

  const cancelEditing = (section: keyof EditingState) => {
    setEditing({ ...editing, [section]: false });
  };

  const handleSave = async (section: keyof EditingState) => {
    try {

        const formattedData = {
            ...formData,
            expected_check_in: formData.expected_check_in?.slice(0, 5) || "",
            expected_check_out: formData.expected_check_out?.slice(0, 5) || "",
        };
        
        await updateSettings(formattedData);
        toast.success('Settings updated successfully');
        setEditing({ ...editing, [section]: false });
        refetch();
    } catch (error) {
        toast.error("Failed to update settings");
    }
};

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleWeekendDay = (day: string) => {
    const current = formData.weekend_days;
    if (current.includes(day)) {
      handleInputChange("weekend_days", current.filter((d) => d !== day));
    } else {
      handleInputChange("weekend_days", [...current, day]);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-1 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <SettingsSkeleton />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              Configure your system preferences and general settings
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Database className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Settings Found</h2>
          <p className="text-gray-500 text-sm text-center max-w-md">
            No settings have been configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Configure your system preferences and general settings
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Last updated:</span>
          <span className="font-medium text-gray-600">
            {settings.updated_at ? new Date(settings.updated_at).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            {!editing.workingHours ? (
              <button
                onClick={() => startEditing("workingHours")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("workingHours")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("workingHours")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Working Hours</h3>
          <div className="space-y-1.5">
            {editing.workingHours ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Check-in:</span>
                  <input
                    type="time"
                    value={formData.expected_check_in?.slice(0, 5) || ""}
                    onChange={(e) => handleInputChange("expected_check_in", e.target.value + ":00")}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Check-out:</span>
                  <input
                    type="time"
                    value={formData.expected_check_out?.slice(0, 5) || ""}
                    onChange={(e) => handleInputChange("expected_check_out", e.target.value + ":00")}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Grace Period:</span>
                  <input
                    type="number"
                    value={formData.grace_period}
                    onChange={(e) => handleInputChange("grace_period", Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Check-in:</span>
                  <span className="font-medium text-gray-700">{formatTimeSettings(settings.expected_check_in)}</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Check-out:</span>
                  <span className="font-medium text-gray-700">{formatTimeSettings(settings.expected_check_out)}</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Grace Period:</span>
                  <span className="font-medium text-gray-700">{settings.grace_period} minutes</span>
                </p>
              </>
            )}
          </div>
          {!editing.workingHours && (
            <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            {!editing.leaveSettings ? (
              <button
                onClick={() => startEditing("leaveSettings")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("leaveSettings")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("leaveSettings")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave Settings</h3>
          <div className="space-y-1.5">
            {editing.leaveSettings ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Annual Leave:</span>
                  <input
                    type="number"
                    value={formData.annual_leave_days}
                    onChange={(e) => handleInputChange("annual_leave_days", Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sick Leave:</span>
                  <input
                    type="number"
                    value={formData.sick_leave_days}
                    onChange={(e) => handleInputChange("sick_leave_days", Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Probation Period:</span>
                  <input
                    type="number"
                    value={formData.probation_period_days}
                    onChange={(e) => handleInputChange("probation_period_days", Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Annual Leave:</span>
                  <span className="font-medium text-gray-700">{settings.annual_leave_days} days</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Sick Leave:</span>
                  <span className="font-medium text-gray-700">{settings.sick_leave_days} days</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Probation Period:</span>
                  <span className="font-medium text-gray-700">{settings.probation_period_days} days</span>
                </p>
              </>
            )}
          </div>
          {!editing.leaveSettings && (
            <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            {!editing.termination ? (
              <button
                onClick={() => startEditing("termination")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("termination")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("termination")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Termination Settings</h3>
          <div className="space-y-1.5">
            {editing.termination ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Notice Period:</span>
                <input
                  type="number"
                  value={formData.termination_notice_days}
                  onChange={(e) => handleInputChange("termination_notice_days", Number(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-between">
                <span>Notice Period:</span>
                <span className="font-medium text-gray-700">{settings.termination_notice_days} days</span>
              </p>
            )}
          </div>
          {!editing.termination && (
            <p className="text-xs text-rose-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            {!editing.weekend ? (
              <button
                onClick={() => startEditing("weekend")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("weekend")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("weekend")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekend Settings</h3>
          <div className="space-y-1.5">
            {editing.weekend ? (
              <div className="flex flex-wrap gap-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleWeekendDay(day)}
                    className={`px-3 py-1 rounded-lg text-sm capitalize border transition-colors ${
                      formData.weekend_days.includes(day)
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-between">
                <span>Weekend Days:</span>
                <span className="font-medium text-gray-700">{formatWeekendDays(settings.weekend_days)}</span>
              </p>
            )}
          </div>
          {!editing.weekend && (
            <p className="text-xs text-purple-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
              <Gavel className="w-6 h-6" />
            </div>
            {!editing.legal ? (
              <button
                onClick={() => startEditing("legal")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("legal")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("legal")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Settings</h3>
          <div className="space-y-1.5">
            {editing.legal ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Jurisdiction:</span>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                  className="flex-1 ml-2 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-between">
                <span>Jurisdiction:</span>
                <span className="font-medium text-gray-700">{settings.jurisdiction}</span>
              </p>
            )}
          </div>
          {!editing.legal && (
            <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-cyan-50 text-cyan-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            {!editing.currency ? (
              <button
                onClick={() => startEditing("currency")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => handleSave("currency")}
                  disabled={isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => cancelEditing("currency")}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Currency Settings</h3>
          <div className="space-y-1.5">
            {editing.currency ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Base Currency:</span>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="flex-1 ml-2 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-between">
                <span>Base Currency:</span>
                <span className="font-medium text-gray-700">{settings.currency}</span>
              </p>
            )}
          </div>
          {!editing.currency && (
            <p className="text-xs text-cyan-600 mt-3 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Click to edit
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-50 text-gray-600 p-3 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">System Info</h3>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-500 flex items-center justify-between">
              <span>Last Updated:</span>
              <span className="font-medium text-gray-700">
                {settings.updated_at ? new Date(settings.updated_at).toLocaleString() : "N/A"}
              </span>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> System information
          </p>
        </div>
      </div>
    </div>
  );
}