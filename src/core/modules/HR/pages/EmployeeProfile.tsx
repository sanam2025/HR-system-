import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import Loading from '../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useEmployeeProfile } from '../hooks/useProfile';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const [editMode, setEditMode] = useState(false);
  const { t, lang } = useLanguage();

  const { profile, isLoading, error, refetch } = useEmployeeProfile(Number(id));  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || '',
    address: profile?.address || '',
  });

  const handleSave = async () => {
    try {      toast.success(t.hrEmployeeProfile?.updateSuccess || 'Profile updated successfully!');
      setEditMode(false);
      refetch();    } catch (err) {
      toast.error(t.hrEmployeeProfile?.updateFailed || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate('/Hr')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrEmployeeProfile?.backToDashboard || 'Back to Dashboard'}
        </button>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-red-500">{t.hrEmployeeProfile?.errorLoading || 'Error loading profile:'} {error}</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            {t.hrEmployeeProfile?.retry || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>      <button
        onClick={() => navigate('/Hr')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
      >
        <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrEmployeeProfile?.backToDashboard || 'Back to Dashboard'}
      </button>      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.hrEmployeeProfile?.title || 'Employee Profile'}</h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Pencil className="w-4 h-4" />
            {t.hrEmployeeProfile?.editProfile || 'Edit Profile'}
          </button>
        )}
      </div>      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editMode ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                profile?.full_name || (t.hrEmployeeProfile?.unknown || 'Unknown')
              )}
            </h2>
            <p className="text-gray-500">{profile?.email || ''}</p>
          </div>
        </div>        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{t.hrEmployeeProfile?.email || 'Email:'} </span>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border rounded px-2 py-1 flex-1"
              />
            ) : (
              <span className="text-sm">{profile?.email || '-'}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{t.hrEmployeeProfile?.phone || 'Phone:'} </span>
            {editMode ? (
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="border rounded px-2 py-1 flex-1"
              />
            ) : (
              <span className="text-sm">{profile?.phone_number || '-'}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{t.hrEmployeeProfile?.address || 'Address:'} </span>
            {editMode ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border rounded px-2 py-1 flex-1"
              />
            ) : (
              <span className="text-sm">{profile?.address || '-'}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{t.hrEmployeeProfile?.birthDate || 'Birth Date:'} </span>
            <span className="text-sm">{profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : '-'}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm">{t.hrEmployeeProfile?.gender || 'Gender:'} </span>
            <span className="text-sm">{profile?.gender || '-'}</span>
          </div>
        </div>        {editMode && (
          <div className="flex gap-3 mt-6 border-t pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {t.hrEmployeeProfile?.saveChanges || 'Save Changes'}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {t.hrEmployeeProfile?.cancel || 'Cancel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}