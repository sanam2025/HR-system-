import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, lastPage, onPageChange }: PaginationControlsProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span className="text-sm font-medium text-gray-500">
        Page {page} of {lastPage}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= lastPage}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
