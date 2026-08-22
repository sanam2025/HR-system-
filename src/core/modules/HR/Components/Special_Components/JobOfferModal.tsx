import React, { useState } from "react";
import { X, DollarSign, Calendar, Gift, FileText, Send } from "lucide-react";
import type { AcceptedCandidate, JobOfferData } from "../../types/acceptedCandidates.types";

interface JobOfferModalProps {
  isOpen: boolean;
  candidate: AcceptedCandidate | null;
  onClose: () => void;
  onSend: (data: JobOfferData) => void;
}

export const JobOfferModal: React.FC<JobOfferModalProps> = ({ isOpen, candidate, onClose, onSend }) => {
  const [formData, setFormData] = useState<JobOfferData>({
    candidateId: "",
    candidateName: "",
    position: "",
    department: "",
    salary: 0,
    startDate: "",
    benefits: "",
    additionalNotes: "",
  });

  React.useEffect(() => {
    if (candidate) {
      setFormData({
        candidateId: candidate.id,
        candidateName: candidate.name,
        position: candidate.position,
        department: candidate.department,
        salary: 0,
        startDate: "",
        benefits: "",
        additionalNotes: "",
      });
    }
  }, [candidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Send Job Offer</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Candidate: <span className="font-semibold text-gray-800">{candidate.name}</span></p>
            <p className="text-sm text-gray-600">Position: <span className="font-semibold text-gray-800">{candidate.position}</span></p>
            <p className="text-sm text-gray-600">Department: <span className="font-semibold text-gray-800">{candidate.department}</span></p>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Monthly) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1500000"
              />
            </div>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
            <div className="relative">
              <Gift className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={2}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Health insurance, annual bonus, etc."
              />
            </div>
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={2}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Any additional information about the offer..."
              />
            </div>
          </div>          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
              Send Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOfferModal;