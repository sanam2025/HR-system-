import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Save } from 'lucide-react';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';
import { updateEmployeeProfile } from '../../../../api/manager';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: number;
  initialData: {
    address?: string;
    picture?: string;
    phone_number?: string;
    birth_date?: string;
    gender?: string;
  };
  onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, profileId, initialData, onSuccess }: EditProfileModalProps) {
  const { lang } = useLanguage();
  const [address, setAddress] = useState(initialData.address || '');
  const [phone, setPhone] = useState(initialData.phone_number || '');
  const [birthDate, setBirthDate] = useState(initialData.birth_date || '');
  const [gender, setGender] = useState(initialData.gender || '');
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData.picture ? `${initialData.picture}?t=${Date.now()}` : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAddress(initialData.address || '');
      setPhone(initialData.phone_number || '');
      setBirthDate(initialData.birth_date || '');
      setGender(initialData.gender || '');
      setPicture(null);
      setPreview(initialData.picture ? `${initialData.picture}?t=${Date.now()}` : '');
      setError('');
      setImgError(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPreview(URL.createObjectURL(file));
      setImgError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    if (address) formData.append('address', address);
    if (phone) formData.append('phone_number', phone);
    if (birthDate) formData.append('birth_date', birthDate);
    if (gender) formData.append('gender', gender);
    if (picture) formData.append('picture', picture);

    try {
      await updateEmployeeProfile(profileId, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-dark">{isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                  {preview && !preview.includes('default.jpg') && !imgError ? (
                    <img 
                      src={preview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">👤</span>
                  )}
                </div>
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={24} />
                  <span className="text-xs mt-1">{isRTL ? 'تغيير' : 'Change'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green focus:border-transparent outline-none transition-all"
                  placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'العنوان' : 'Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green focus:border-transparent outline-none transition-all"
                  placeholder={isRTL ? 'أدخل العنوان الجديد' : 'Enter new address'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'تاريخ الميلاد' : 'Birth Date'}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الجنس' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green focus:border-transparent outline-none transition-all"
                >
                  <option value="">{isRTL ? 'اختر...' : 'Select...'}</option>
                  <option value="male">{isRTL ? 'ذكر' : 'Male'}</option>
                  <option value="female">{isRTL ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl font-medium transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            form="editProfileForm"
            disabled={loading}
            className="px-5 py-2 bg-green text-white rounded-xl font-medium hover:bg-green-dark transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
