export const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200" },
    cancelled: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500", border: "border-gray-200" },
  };

  const { bg, text, dot, border } = config[status as keyof typeof config] || config.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};