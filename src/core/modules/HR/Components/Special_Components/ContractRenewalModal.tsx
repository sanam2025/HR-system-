import React, { useState } from "react";
import { X, Calendar, DollarSign, Send } from "lucide-react";
import type { EmployeeContract } from "../../types/contract.types";

interface ContractRenewalModalProps {
  isOpen: boolean;
  contract: EmployeeContract | null;
  onClose: () => void;
  onSubmit: (data: {
    contractId: string;
    employeeId: string;
    employeeName: string;
    oldEndDate: string;
    newEndDate: string;
    newSalary?: number;
    renewalReason: string;
  }) => void;
}

export const ContractRenewalModal: React.FC<ContractRenewalModalProps> = ({
  isOpen,
  contract,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    newEndDate: "",
    newSalary: contract?.salary || 0,
    renewalReason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      onSubmit({
        contractId: contract.id,
        employeeId: contract.employeeId,
        employeeName: contract.employeeName,
        oldEndDate: contract.endDate,
        newEndDate: formData.newEndDate,
        newSalary: formData.newSalary,
        renewalReason: formData.renewalReason,
      });
    }
    onClose();
  };

  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Contract Renewal Proposal</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <p className="text-sm text-gray-600"><span className="font-medium">Employee:</span> {contract.employeeName}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Current End Date:</span> {contract.endDate}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New End Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="newEndDate"
                value={formData.newEndDate}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Salary (if any)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="newSalary"
                value={formData.newSalary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Same as current"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Reason *</label>
            <textarea
              name="renewalReason"
              value={formData.renewalReason}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="e.g., Satisfactory performance, Business needs, etc."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
              Send Renewal Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractRenewalModal;