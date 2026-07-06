// ==============================================================
// ManagerProfile — الملف الشخصي للمدير مع إمكانية التعديل
// ==============================================================

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, Building2, Calendar, Edit2, Save, X, Camera, Loader2, BadgeCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { getMyProfile, saveMyProfile } from '../../../api/manager';

// ── helpers ──────────────────────────────────────────────────

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

// ── main ─────────────────────────────────────────────────────

export default function ManagerProfile() {
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing]       = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone_number: '', address: '', bio: '',
  });

  const ar = lang === 'ar';

  // ── fetch profile ──
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    retry: false,
    onSuccess: (data: any) => {
      setForm({
        name:         data.name         || data.user?.name         || '',
        email:        data.email        || data.user?.email        || '',
        phone_number: data.phone_number || '',
        address:      data.address      || '',
        bio:          data.bio          || '',
      });
    },
  });

  // ── mutation ──
  const mutation = useMutation({
    mutationFn: (fd: FormData) => saveMyProfile(profile?.profile_id || profile?.id || null, fd),
    onSuccess: () => {
      toast.success(ar ? 'تم حفظ الملف الشخصي بنجاح ✅' : 'Profile saved successfully ✅');
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      setEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    },
    onError: () => {
      toast.error(ar ? 'حدث خطأ أثناء الحفظ' : 'Failed to save changes');
    },
  });

  // ── handlers ──
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append('name',         form.name);
    fd.append('phone_number', form.phone_number);
    fd.append('address',      form.address);
    fd.append('bio',          form.bio);
    if (avatarFile) fd.append('avatar', avatarFile);
    mutation.mutate(fd);
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    if (profile) {
      setForm({
        name:         profile.name         || profile.user?.name  || '',
        email:        profile.email        || profile.user?.email || '',
        phone_number: profile.phone_number || '',
        address:      profile.address      || '',
        bio:          profile.bio          || '',
      });
    }
  };

  // ── loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 gap-3">
        <Loader2 size={24} className="animate-spin" />
        <span>{ar ? 'جاري التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  const displayName   = profile?.name         || profile?.user?.name         || (ar ? 'المدير' : 'Manager');
  const displayEmail  = profile?.email        || profile?.user?.email        || '';
  const displayPhone  = profile?.phone_number || '';
  const displayDept   = profile?.department   || profile?.department_name    || '';
  const displayJoin   = profile?.join_date    || profile?.joining_date        || '';
  const displayAvatar = avatarPreview || profile?.avatar_url || profile?.avatar || null;
  const initials      = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">

        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-green/20 via-green/10 to-transparent" />

        {/* Avatar + name */}
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">

            {/* Avatar */}
            <div className="relative w-20 h-20 flex-shrink-0">
              {displayAvatar ? (
                <img src={displayAvatar} alt={displayName} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-green text-white flex items-center justify-center text-3xl font-extrabold border-4 border-white shadow-md">
                  {initials}
                </div>
              )}
              {editing && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 end-0 w-7 h-7 bg-green text-white rounded-full flex items-center justify-center shadow-md hover:bg-green/90 transition-colors"
                  >
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </>
              )}
            </div>

            {/* Name + role */}
            <div className="flex-1 pb-1">
              {editing ? (
                <input
                  className="form-input text-lg font-bold w-full max-w-xs"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={ar ? 'الاسم الكامل' : 'Full Name'}
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-extrabold text-dark">{displayName}</h3>
                  <span className="flex items-center gap-1 text-xs bg-green/10 text-green px-2.5 py-0.5 rounded-full font-semibold">
                    <BadgeCheck size={12} />
                    {ar ? 'مدير قسم' : 'Department Manager'}
                  </span>
                </div>
              )}
              {displayDept && (
                <p className="text-sm text-brown mt-1 flex items-center gap-1">
                  <Building2 size={13} />
                  {displayDept}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {editing ? (
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
      </div>

      {/* ── Info Section ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
          <User size={16} className="text-green" />
          {ar ? 'المعلومات الشخصية' : 'Personal Information'}
        </h4>

        {editing ? (
          <div className="space-y-4">
            {/* Email — read only */}
            <div>
              <label className="form-label">{ar ? 'البريد الإلكتروني' : 'Email'}</label>
              <input className="form-input bg-gray-50 cursor-not-allowed" value={form.email} disabled />
              <p className="text-xs text-gray-400 mt-1">{ar ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{ar ? 'رقم الهاتف' : 'Phone'}</label>
                <input
                  className="form-input"
                  value={form.phone_number}
                  onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))}
                  placeholder={ar ? '+963 9XX XXX XXXX' : '+1 (XXX) XXX-XXXX'}
                />
              </div>
              <div>
                <label className="form-label">{ar ? 'العنوان' : 'Address'}</label>
                <input
                  className="form-input"
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder={ar ? 'المدينة، الدولة' : 'City, Country'}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <InfoRow icon={Mail}     label={ar ? 'البريد الإلكتروني' : 'Email'}      value={displayEmail} />
            <InfoRow icon={Phone}    label={ar ? 'رقم الهاتف'        : 'Phone'}      value={displayPhone} />
            <InfoRow icon={Building2} label={ar ? 'القسم'            : 'Department'} value={displayDept} />
            <InfoRow icon={Calendar} label={ar ? 'تاريخ الانضمام'    : 'Join Date'}  value={displayJoin} />
          </div>
        )}
      </div>
    </div>
  );
}
