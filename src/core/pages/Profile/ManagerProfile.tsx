
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, Building2, Calendar, Edit2, Save, X, Camera, Loader2, BadgeCheck, MapPin, User2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { getMyProfile, saveMyProfile } from '../../../api/manager';
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-dark mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}
export default function ManagerProfile() {
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [form, setForm] = useState({
    phone_number: '', address: '', bio: '',
    birth_date: '', gender: '', hiring_date: '', department: '',
  });

  const ar = lang === 'ar';  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    retry: false,
  });  useEffect(() => {
    if (profile) {
      setForm({
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        bio: profile.bio || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        hiring_date: profile.hiring_date || '',
        department: profile.department || '',
      });
    }
  }, [profile]);  const mutation = useMutation({
    mutationFn: (fd: FormData) => saveMyProfile(profile?.id || null, fd),
    onSuccess: () => {
      toast.success(ar ? 'تم حفظ الملف الشخصي بنجاح ✅' : 'Profile saved successfully ✅');
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      setEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || (ar ? 'حدث خطأ أثناء الحفظ' : 'Failed to save changes');
      toast.error(msg);
    },
  });  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append('phone_number', form.phone_number);
    fd.append('address', form.address);
    if (form.bio) fd.append('bio', form.bio);
    if (form.birth_date) fd.append('birth_date', form.birth_date);
    if (form.gender) fd.append('gender', form.gender);
    if (form.hiring_date) fd.append('hiring_date', form.hiring_date);
    if (form.department) fd.append('department', form.department);
    if (avatarFile) fd.append('picture', avatarFile);

    mutation.mutate(fd);
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    if (profile) {
      setForm({
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        bio: profile.bio || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        hiring_date: profile.hiring_date || '',
        department: profile.department || '',
      });
    }
  };  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 gap-3">
        <Loader2 size={24} className="animate-spin" />
        <span>{ar ? 'جاري التحميل...' : 'Loading...'}</span>
      </div>
    );
  }  const displayName = profile?.user_name || (ar ? 'المدير' : 'Manager');
  const displayEmail = profile?.user_email || '';
  const displayPhone = profile?.phone_number || '';
  const displayDept = profile?.department || '';
  const displayJoin = profile?.hiring_date || '';
  const displayBirth = profile?.birth_date || '';
  const displayGender = profile?.gender || '';
  const displayAddr = profile?.address || '';
  const displayPicture = avatarPreview || profile?.picture || null;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{ar ? 'الملف الشخصي' : 'My Profile'}</h2>
          <p className="text-sm text-brown mt-1">{ar ? 'عرض وتعديل معلوماتك الشخصية' : 'View and edit your personal information'}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Edit2 size={16} />
            {ar ? 'تعديل الملف' : 'Edit Profile'}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="btn btn-primary flex items-center gap-2"
            >
              {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {ar ? 'حفظ' : 'Save'}
            </button>
            <button onClick={handleCancel} className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2">
              <X size={16} />
              {ar ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        )}
      </div>      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">        <div className="h-32 bg-gradient-to-r from-green/20 via-green/10 to-transparent" />        <div className="px-6 pb-6 -mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">            <div className="relative flex-none w-[144px] h-[144px]">
              {displayPicture ? (
                <img 
                  src={displayPicture} 
                  alt={displayName} 
                  className="w-full h-full rounded-3xl object-cover border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition-opacity" 
                  onClick={() => setIsImageModalOpen(true)}
                />
              ) : (
                <div className="w-full h-full rounded-3xl bg-green text-white flex items-center justify-center text-5xl font-extrabold border-4 border-white shadow-md">
                  {initials}
                </div>
              )}
              {editing && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -end-2 w-10 h-10 bg-green text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-green/90 transition-colors border-2 border-white"
                  >
                    <Camera size={18} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </>
              )}
            </div>            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-dark">{displayName}</h3>
                <span className="flex items-center gap-1 text-xs bg-green/10 text-green px-2.5 py-0.5 rounded-full font-semibold">
                  <BadgeCheck size={12} />
                  {ar ? 'مدير قسم' : 'Department Manager'}
                </span>
              </div>
              {displayDept && (
                <p className="text-sm text-brown mt-1 flex items-center gap-1">
                  <Building2 size={13} />
                  {displayDept}
                </p>
              )}
            </div>
          </div>          {editing ? (
            <div className="mt-4">
              <label className="form-label">{ar ? 'نبذة شخصية' : 'Bio'}</label>
              <textarea
                className="form-input resize-none h-20"
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder={ar ? 'اكتب نبذة قصيرة عنك...' : 'Write a short bio...'}
              />
            </div>
          ) : (
            profile?.bio && (
              <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                {profile.bio}
              </p>
            )
          )}
        </div>
      </div>      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
          <User size={16} className="text-green" />
          {ar ? 'المعلومات الشخصية' : 'Personal Information'}
        </h4>

        {editing ? (
          <div className="space-y-4">            <div>
              <label className="form-label">{ar ? 'البريد الإلكتروني' : 'Email'}</label>
              <input className="form-input bg-gray-50 cursor-not-allowed" value={displayEmail} disabled />
              <p className="text-xs text-gray-400 mt-1">{ar ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="form-label">{ar ? 'العنوان' : 'Address'}</label>
                <input
                  className="form-input"
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder={ar ? 'المدينة، الدولة' : 'City, Country'}
                />
              </div>
              <div>
                <label className="form-label">{ar ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.birth_date}
                  onChange={e => setForm(p => ({ ...p, birth_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">{ar ? 'الجنس' : 'Gender'}</label>
                <select
                  className="form-input"
                  value={form.gender}
                  onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                >
                  <option value="">{ar ? 'اختر...' : 'Select...'}</option>
                  <option value="male">{ar ? 'ذكر' : 'Male'}</option>
                  <option value="female">{ar ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <InfoRow icon={Mail} label={ar ? 'البريد الإلكتروني' : 'Email'} value={displayEmail} />
            <InfoRow icon={Building2} label={ar ? 'القسم' : 'Department'} value={displayDept} />
            <InfoRow icon={Calendar} label={ar ? 'تاريخ التعيين' : 'Hiring Date'} value={displayJoin} />
            <InfoRow icon={Calendar} label={ar ? 'تاريخ الميلاد' : 'Birth Date'} value={displayBirth} />
            <InfoRow icon={User2} label={ar ? 'الجنس' : 'Gender'} value={ar ? (displayGender === 'male' ? 'ذكر' : displayGender === 'female' ? 'أنثى' : displayGender) : displayGender} />
            <InfoRow icon={MapPin} label={ar ? 'العنوان' : 'Address'} value={displayAddr} />
          </div>
        )}
      </div>      {isImageModalOpen && displayPicture && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-4 end-4 text-white hover:text-gray-300 bg-black/40 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <X size={24} />
            </button>
            <img 
              src={displayPicture} 
              alt={displayName} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

