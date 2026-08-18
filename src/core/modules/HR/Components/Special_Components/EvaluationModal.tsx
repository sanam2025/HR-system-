// core/modules/HR/Components/Special_Components/EvaluationModal.tsx
import React, { useState } from "react";
import { X, Star, FileText } from "lucide-react";
import type { Employee } from "../../types/employee.types";

interface EvaluationModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (employeeId: string, rating: number, comments: string) => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, employee, onClose, onSave }) => {
  const [rating, setRating] = useState<number>(3);
  const [comments, setComments] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      onSave(employee.id, rating, comments);
      setRating(3);
      setComments("");
      onClose();
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Employee Evaluation</h2>
            <p className="text-sm text-gray-500 mt-0.5">Rate and provide feedback for {employee.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Employee: <span className="font-semibold text-gray-800">{employee.name}</span></p>
            <p className="text-sm text-gray-600">Position: <span className="font-semibold text-gray-800">{employee.jobTitle}</span></p>
            <p className="text-sm text-gray-600">Department: <span className="font-semibold text-gray-800">{employee.department}</span></p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {rating === 1 && "Poor - Needs significant improvement"}
              {rating === 2 && "Below Average - Requires development"}
              {rating === 3 && "Average - Meets expectations"}
              {rating === 4 && "Good - Exceeds expectations"}
              {rating === 5 && "Excellent - Outstanding performance"}
            </p>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments / Notes</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Write your feedback about the employee's performance..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green rounded-lg hover:bg-green-dark transition-colors">
              Save Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;