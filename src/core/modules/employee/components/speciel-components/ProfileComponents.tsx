import { useState } from "react";
import type { FormEvent } from "react";
import { DoorOpen, KeyRound, Upload, Camera, User } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";
import type {
  Contract,
  CreateProfilePayload,
  CreateResignationPayload,
  Gender,
  Profile,
  Resignation,
  UpdateProfilePayload,
} from "../../../../../api/models";

function initialsFrom(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * CONFIRMED via live backend testing: after a profile picture upload, the
 * `picture` URL the backend returns points at the request's temp-upload
 * path (e.g. `.../storage//home/masarhr/admin/tmp/phpXXXXXXXX`) instead of
 * wherever the file actually got persisted — a backend bug, not a request
 * problem (the multipart upload itself succeeds). That temp file is gone
 * by the time the browser requests it, so the `<img>` would otherwise show
 * a broken-image icon forever. Falls back to initials instead once the
 * image fails to load, and remembers the failure per URL so a legitimate
 * new picture (a different URL) gets a fresh attempt.
 */
function ProfileAvatar({ fullName, pictureUrl, isEditing, onPictureChange, onPictureClick }: { fullName: string; pictureUrl?: string | null; isEditing?: boolean; onPictureChange?: (file: File | null) => void; onPictureClick?: () => void; }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = pictureUrl && pictureUrl !== failedUrl;

  return (
    <div
      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0 overflow-hidden group shadow-md border-2 border-white"
      aria-label={`${fullName}'s avatar`}
    >
      {showImage ? (
        <img
          src={pictureUrl}
          alt={`${fullName} picture`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={onPictureClick}
          onError={() => setFailedUrl(pictureUrl)}
        />
      ) : (
        <span className="cursor-pointer" onClick={onPictureClick}>{initialsFrom(fullName)}</span>
      )}
      {isEditing && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 pointer-events-none transition-all duration-200 opacity-60 hover:opacity-100">
          <label className="cursor-pointer pointer-events-auto p-2 rounded-full hover:bg-white/20 transition-colors" title="تغيير الصورة">
            <Camera size={32} className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPictureChange?.(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      )}
    </div>
  );
}

export function ProfileHeader({
  fullName,
  pictureUrl,
  jobTitle,
  department,
  onEditToggle,
  isEditing,
  onPictureChange,
  onPictureClick,
  hasProfile
}: {
  fullName: string;
  pictureUrl?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  onEditToggle: () => void;
  isEditing: boolean;
  onPictureChange?: (file: File | null) => void;
  onPictureClick?: () => void;
  hasProfile?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <section className="bg-surface rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 border-r-4 border-r-green flex flex-col sm:flex-row items-center gap-5 sm:gap-6 transition-all duration-200 hover:shadow-md animate-scale-in">
      <ProfileAvatar fullName={fullName} pictureUrl={pictureUrl} isEditing={isEditing} onPictureChange={onPictureChange} onPictureClick={onPictureClick} />
      <div className="flex-1 min-w-0 text-center sm:text-start">
        <h2 className="text-xl sm:text-2xl font-bold text-dark truncate">{fullName}</h2>
        {jobTitle || department ? (
          <div className="text-sm font-semibold text-brown mt-2 flex flex-wrap gap-x-4 gap-y-2 items-center justify-center sm:justify-start">
            {jobTitle && <p className="truncate flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold"></span> {jobTitle}</p>}
            {department && <p className="truncate flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green"></span> {department}</p>}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-1">
            {t.profile?.fillData || "Please fill in your profile data."}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onEditToggle}
        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.97] ${
          isEditing 
            ? "bg-white text-green border-2 border-green hover:bg-green hover:text-white" 
            : "bg-green text-white hover:bg-green-dark hover:shadow-md"
        }`}
      >
        {isEditing ? t.profile?.cancel || "Cancel" : (hasProfile ? (t.profile?.editProfile || "Edit Profile") : (t.profile?.createProfile || "Create Profile"))}
      </button>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-dark break-words">{value}</p>
    </div>
  );
}

export function PersonalDetailsCard({ profile }: { profile: Profile | undefined | null }) {
  const { t } = useLanguage();
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 border-t-4 border-t-green h-full flex flex-col transition-all hover:shadow-md">
      <h3 className="text-base font-bold text-dark mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        {t.profile?.personalDetails || "Personal Details"}
      </h3>
      {!profile ? (
        <p className="text-sm text-gray-400">
          {t.profile?.noProfile || "No profile on file yet — use 'Edit Profile' above to create one."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 flex-1 rtl:text-right ltr:text-left">
          <DetailRow label={t.profile?.gender || "Gender"} value={profile.gender === "male" ? (t.profile?.male || "Male") : (t.profile?.female || "Female")} />
          <DetailRow label={t.profile?.dob || "Date of Birth"} value={profile.birth_date} />
          <DetailRow label={t.profile?.address || "Address"} value={profile.address} />
        </div>
      )}
    </section>
  );
}

export interface ProfileFormValues {
  gender: Gender;
  birth_date: string;
  address: string;
  phone_number?: string;
}

function formatDateForInput(dateStr?: string | null): string {
  if (!dateStr) return "";
  const clean = dateStr.split("T")[0].split(" ")[0]; // Handle timestamp
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const parts = clean.includes("/") ? clean.split("/") : clean.split("-");
  if (parts.length === 3) {
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
  }
  return clean;
}

export function ProfileForm({
  initialValues,
  requirePicture,
  onSubmit,
  isSubmitting,
  errorMessage,
}: {
  initialValues?: Partial<ProfileFormValues>;
  requirePicture: boolean;
  onSubmit: (payload: CreateProfilePayload | UpdateProfilePayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}) {
  const { t } = useLanguage();
  const [gender, setGender] = useState<Gender>(initialValues?.gender ?? "male");
  const [birthDate, setBirthDate] = useState(formatDateForInput(initialValues?.birth_date));
  const [address, setAddress] = useState(initialValues?.address ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requirePicture) return; // Prevent if picture is missing and required
    const validPhone = initialValues?.phone_number ? initialValues.phone_number : "0000000000";

    onSubmit({
      gender,
      birth_date: birthDate,
      phone_number: validPhone,
      address,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 border-t-4 border-t-green transition-all duration-200">
      <h3 className="text-base font-bold text-dark border-b border-gray-50 pb-4 flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        {t.profile?.updateProfile || "Update Profile"}
      </h3>
      
      {requirePicture && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-4 border border-red-100 flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {t.profile?.requirePic || "Please upload a profile picture by clicking on the avatar space above."}
        </div>
      )}
      
      {errorMessage && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rtl:text-right ltr:text-left">
        <div>
          <label htmlFor="profile-gender" className="block text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">
            {t.profile?.gender || "Gender"}
          </label>
          <select
            id="profile-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
          >
            <option value="male">{t.profile?.male || "Male"}</option>
            <option value="female">{t.profile?.female || "Female"}</option>
          </select>
        </div>
        <div>
          <label htmlFor="profile-birth-date" className="block text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">
            {t.profile?.dob || "Date of Birth"}
          </label>
          <input
            id="profile-birth-date"
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
          />
        </div>
        <div>
          <label htmlFor="profile-address" className="block text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">
            {t.profile?.address || "Address"}
          </label>
          <input
            id="profile-address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="مثال: حلب، سوريا"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || requirePicture}
        className="w-full py-3 bg-green text-white rounded-xl text-sm font-bold shadow-sm hover:bg-green-dark hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isSubmitting ? t.profile?.saving || "Saving..." : t.profile?.saveProfile || "Save Profile"}
      </button>
    </form>
  );
}

export function DocumentsCard({
  onUpload,
  isUploading,
  errorMessage,
  status,
  successMessage,
}: {
  onUpload: (files: { id_card: File; photo: File; bank_info: File }) => void;
  isUploading: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  status?: {
    completed: boolean;
    uploaded_documents: string[];
    missing_documents: string[];
  } | null;
}) {
  const { t } = useLanguage();
  const [idCard, setIdCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [bankInfo, setBankInfo] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!idCard || !photo || !bankInfo) return;
    onUpload({ id_card: idCard, photo, bank_info: bankInfo });
  }

  const handleViewUploaded = async (docType: string) => {
    try {
      const { httpClient } = await import("../../../../../lib/http/client");
      const docsRes = await httpClient.get('/my/documents');
      const docs = Array.isArray(docsRes.data) ? docsRes.data : docsRes.data?.data || [];
      const targetDoc = docs.find((d: any) => d.type === docType);

      if (!targetDoc) {
        throw new Error("Document not found in the backend records.");
      }
      const res = await httpClient.get(`/my-documents/${targetDoc.id}/download`, { responseType: 'blob' });
      
      const blobUrl = URL.createObjectURL(res.data as any);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err: any) {
      console.error("Error fetching document:", err);
      import("react-hot-toast").then(({ default: toast }) => {
        toast.error("حدث خطأ أثناء فتح الملف. تأكد من توفر الملف على السيرفر.");
      });
    }
  };

  const isUploaded = (type: string) => status?.uploaded_documents?.includes(type);

  const renderDocInput = (
    id: string,
    labelTitle: string,
    accept: string,
    file: File | null,
    setFile: (f: File | null) => void,
    placeholder: string
  ) => {
    if (isUploaded(id)) {
      return (
        <div>
          <label className="block text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">{labelTitle}</label>
          <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-green/20 text-sm bg-surface transition-all">
            <span className="text-dark font-bold truncate flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green"></span>
              {t.profile?.uploaded || "Uploaded"}
            </span>
            <button
              type="button"
              onClick={() => handleViewUploaded(id)}
              className="px-4 py-1.5 bg-green text-white rounded-lg text-xs font-bold hover:bg-green-dark transition-all shadow-sm active:scale-[0.97]"
            >
              {t.profile?.view || "View"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={id} className="block text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">
          {labelTitle}
        </label>
        <div className="relative">
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <label
            htmlFor={id}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white cursor-pointer hover:border-gold hover:shadow-sm transition-all"
          >
            <span className={file ? "text-green font-bold truncate flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row" : "text-gray-400 font-medium truncate"}>
              {file && <span className="w-2 h-2 rounded-full bg-green"></span>}
              {file ? t.profile?.attached || "Attached" : placeholder}
            </span>
            <span className="px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-xs font-bold whitespace-nowrap hover:bg-gold/20 transition-colors">
              {t.profile?.browse || "Browse"}
            </span>
          </label>
        </div>
      </div>
    );
  };

  const needsUpload = !isUploaded("id_card") || !isUploaded("photo") || !isUploaded("bank_info");

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 border-t-4 border-t-brown transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rtl:text-right ltr:text-left">
      <h3 className="text-base font-bold text-dark mb-6 border-b border-gray-50 pb-4 flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        {t.profile?.documents || "Documents"}
      </h3>
      
      {status && status.completed && (
        <div className="mb-6 rounded-2xl border border-green-light bg-surface p-5 text-sm">
          <p className="font-bold text-green flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t.profile?.docsUploaded || "Onboarding documents uploaded"}
          </p>
          <p className="text-xs text-brown mt-1.5 font-medium">{t.profile?.docsUploadedSub || "You have uploaded all required documents."}</p>
        </div>
      )}

      {status && !status.completed && status.missing_documents.length > 0 && (
        <div className="mb-6 rounded-2xl border-l-4 border-gold bg-gold/5 p-5 text-sm rtl:border-r-4 rtl:border-l-0">
          <p className="font-bold text-dark">{t.profile?.docsReq || "Onboarding documents required"}</p>
          <p className="text-xs text-brown mt-1.5 font-medium">{t.profile?.docsReqSub || "Please upload the missing documents below."}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2 space-y-5">
        {errorMessage && (
          <p role="alert" className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p role="status" className="text-xs text-green bg-green/10 p-3 rounded-xl border border-green/20 font-bold">
            {successMessage}
          </p>
        )}
        
        {needsUpload && <p className="text-xs font-semibold text-brown uppercase tracking-wide">{t.profile?.attachFollowing || "Please attach the following documents:"}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rtl:text-right ltr:text-left">
          {renderDocInput("id_card", t.profile?.idCard || "ID Card", "image/*,application/pdf", idCard, setIdCard, t.profile?.chooseFile || "Choose File")}
          {renderDocInput("photo", t.profile?.photo || "Photo", "image/*", photo, setPhoto, t.profile?.choosePhoto || "Choose Photo")}
          {renderDocInput("bank_info", t.profile?.bankInfo || "Bank Information", "image/*,application/pdf", bankInfo, setBankInfo, t.profile?.chooseFile || "Choose File")}
        </div>

        {needsUpload && (
          <button
            type="submit"
            disabled={isUploading || (!idCard && !isUploaded("id_card")) || (!photo && !isUploaded("photo")) || (!bankInfo && !isUploaded("bank_info"))}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green text-white rounded-xl text-sm font-bold shadow-sm hover:bg-green-dark hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 active:scale-[0.98]"
          >
            <Upload size={16} />
            {isUploading ? t.profile?.uploading || "Uploading..." : t.profile?.uploadDocs || "Upload"}
          </button>
        )}
      </form>
    </section>
  );
}

export interface ChangePasswordCardProps {
  onSubmit: (payload: { password: string; password_confirmation: string }) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function ChangePasswordCard({
  onSubmit,
  isSubmitting,
  errorMessage,
  successMessage,
}: ChangePasswordCardProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const mismatch = confirmation.length > 0 && password !== confirmation;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || mismatch) return;
    onSubmit({ password, password_confirmation: confirmation });
    setPassword("");
    setConfirmation("");
  }

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-dark mb-3 sm:mb-4">
        <KeyRound size={16} aria-hidden="true" />
        Change Password
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMessage && (
          <p role="alert" className="text-xs text-red-600">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p role="status" className="text-xs text-green-600">
            {successMessage}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="new-password" className="block text-xs text-gray-500 mb-1">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs text-gray-500 mb-1">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
        </div>
        {mismatch && <p className="text-xs text-red-600">Passwords do not match.</p>}
        <button
          type="submit"
          disabled={isSubmitting || mismatch}
          className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Updating…" : "Update Password"}
        </button>
      </form>
    </section>
  );
}

export function EmploymentStatusCard({
  contract,
  managerName,
}: {
  contract: Contract | undefined | null;
  managerName?: string | null;
}) {
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-4 sm:mb-5">Employment Status</h3>
      {!contract ? (
        <p className="text-sm text-gray-400">No contract on file.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Start Date</p>
            <p className="text-sm font-medium text-dark">{contract.start_date}</p>
            {contract.end_date && (
              <p className="text-xs text-gray-400 mt-0.5">Ends {contract.end_date}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Hourly Rate</p>
            <p className="text-sm font-medium text-dark">{contract.hour_price}</p>
            <p className="text-xs text-gray-400 mt-0.5">{contract.working_hour_per_day}h / day</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Manager</p>
            {managerName ? (
              <p className="text-sm font-medium text-dark">{managerName}</p>
            ) : (
              <p className="text-sm text-gray-400">Not available from the API yet.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function resignationStatusVariant(status?: string): "success" | "warning" | "danger" | "default" {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "approved" || normalized === "accepted") return "success";
  if (normalized === "rejected" || normalized === "cancelled") return "danger";
  if (normalized.startsWith("pending")) return "warning";
  return "default";
}

export interface ResignationCardProps {
  resignations: Resignation[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: CreateResignationPayload) => void;
  isSubmitting: boolean;
  submitError?: string | null;
  successMessage?: string | null;
}

/**
 * Only `"immediate"` is a CONFIRMED valid resignation `type` (see
 * `CreateResignationPayload` in models.ts) — the dropdown only offers what's
 * actually known to work rather than guessing at the rest of the enum.
 */
export function ResignationCard({
  resignations,
  isLoading,
  errorMessage,
  onSubmit,
  isSubmitting,
  submitError,
  successMessage,
}: ResignationCardProps) {
  const [reason, setReason] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason) return;
    onSubmit({ type: "immediate", reason });
    setReason("");
  }

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-dark mb-3 sm:mb-4">
        <DoorOpen size={16} aria-hidden="true" />
        Resignation
      </h3>

      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : resignations && resignations.length > 0 ? (
        <div className="space-y-2 mb-4">
          {resignations.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">{r.reason}</p>
                {r.created_at && <p className="text-xs text-gray-400">{r.created_at}</p>}
              </div>
              {r.status && (
                <Badge variant={resignationStatusVariant(r.status)}>{humanizeStatus(r.status)}</Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-4">You haven't submitted a resignation.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {submitError && (
          <p role="alert" className="text-xs text-red-600">
            {submitError}
          </p>
        )}
        {successMessage && (
          <p role="status" className="text-xs text-green-600">
            {successMessage}
          </p>
        )}
        <div>
          <label htmlFor="resignation-reason" className="block text-xs text-gray-500 mb-1">
            Reason for immediate resignation
          </label>
          <textarea
            id="resignation-reason"
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Submit Immediate Resignation"}
        </button>
      </form>
    </section>
  );
}
