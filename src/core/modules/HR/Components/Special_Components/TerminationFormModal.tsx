import React, { useState } from "react";
import { X, Briefcase, User, Calendar, FileText, DollarSign, Upload, Send } from "lucide-react";
import type { TerminationType, TerminationRequest, CompensationDetails } from "../../types/termination.types";
import { calculateCompensation } from "../../types/termination.types";

interface TerminationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TerminationRequest>) => void;
}

const terminationTypes: { value: TerminationType; label: string }[] = [
  { value: "termination", label: "Termination" },
  { value: "contractEnd", label: "Contract End" },
  { value: "resignation", label: "Resignation" },
  { value: "retirement", label: "Retirement" },
];

export const TerminationFormModal: React.FC<TerminationFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    position: "",
    terminationType: "termination" as TerminationType,
    effectiveDate: "",
    reason: "",
    baseSalary: 0,
    yearsOfService: 0,
  });

  const [uploads, setUploads] = useState<File[]>([]);
  const [compensation, setCompensation] = useState<CompensationDetails | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));    if (name === "baseSalary" || name === "yearsOfService") {
      const baseSalary = name === "baseSalary" ? Number(value) : formData.baseSalary;
      const yearsOfService = name === "yearsOfService" ? Number(value) : formData.yearsOfService;
      if (baseSalary > 0 && yearsOfService > 0) {
        setCompensation(calculateCompensation(baseSalary, yearsOfService));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploads([...uploads, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      employeeName: "",
      employeeId: "",
      department: "",
      position: "",
      terminationType: "termination",
      effectiveDate: "",
      reason: "",
      baseSalary: 0,
      yearsOfService: 0,
    });
    setUploads([]);
    setCompensation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Termination Request</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>        <form onSubmit={handleSubmit} className="p-6 space-y-5">          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Termination Type *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select name="terminationType" value={formData.terminationType} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                  {terminationTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Termination *</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Provide detailed reason for termination..." />
          </div>          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Compensation Calculation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (SYP)</label>
                <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
                <input type="number" name="yearsOfService" value={formData.yearsOfService} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="0" step="0.5" />
              </div>
            </div>
            {compensation && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">End of Service Benefit: <span className="font-semibold text-green-600">{compensation.endOfServiceBenefit.toLocaleString()} SYP</span></p>
                <p className="text-sm text-gray-600 mt-1">Total Compensation: <span className="font-semibold text-green-600">{compensation.totalCompensation.toLocaleString()} SYP</span></p>
              </div>
            )}
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag & drop files here or click to upload</p>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="mt-2 inline-block px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                Select Files
              </label>
            </div>
            {uploads.length > 0 && (
              <div className="mt-2">
                {uploads.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-500"> {file.name}</div>
                ))}
              </div>
            )}
          </div>          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
              <Send className="w-4 h-4" />
              Submit Termination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminationFormModal;