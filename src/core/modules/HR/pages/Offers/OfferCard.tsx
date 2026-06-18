// src/core/modules/HR/pages/Offers/OfferCard.tsx
import type { Offer } from '../../../../../api/service/HrService/OfferService';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
            {offer.candidate_name?.charAt(0) || '?'}
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900">{offer.candidate_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">#{offer.candidate_id}</td>
      <td className="px-6 py-4 text-sm text-gray-900">${offer.hour_price}/hr</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {new Date(offer.start_date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{offer.working_hour_per_day} hrs/day</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {offer.weekend_days?.join(', ') || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(offer.status)}`}>
          {offer.status}
        </span>
      </td>
    </tr>
  );
};

export default OfferCard;