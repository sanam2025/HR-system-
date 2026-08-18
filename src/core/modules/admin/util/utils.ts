export const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getPriorityStyles = (priority: string) => {
    switch(priority) {
        case 'high':
            return 'bg-red-50 text-red-600 border-red-200';
        case 'medium':
            return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        case 'low':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
};

export const getStatusStyles = (status: string) => {
    switch(status) {
        case 'active':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'scheduled':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        default:
            return 'bg-gray-50 text-gray-500 border-gray-200';
    }
};

export const getTargetAudienceLabel = (target: string) => {
    switch(target) {
        case 'all':
            return 'All Employees';
        case 'managers':
            return 'Managers Only';
        case 'department':
            return 'Specific Department';
        default:
            return target;
    }
};

export const formatTimeSettings = (time: string) => {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const formatWeekendDays = (days: string[]) => {
  if (!days || days.length === 0) return "None";
  return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ");
};