import { useState } from "react";
import type { FormEvent } from "react";
import { DoorOpen, KeyRound, Upload } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
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
function ProfileAvatar({ fullName, pictureUrl }: { fullName: string; pictureUrl?: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = pictureUrl && pictureUrl !== failedUrl;

  return (
    <div
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 overflow-hidden"
      aria-label={`${fullName}'s avatar`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pictureUrl}
          alt={`${fullName} picture`}
          className="w-full h-full object-cover"
          onError={() => setFailedUrl(pictureUrl)}
        />
      ) : (
        initialsFrom(fullName)
      )}
    </div>
  );
}

export function ProfileHeader({
  fullName,
  pictureUrl,
  jobTitle,
  department,
  employeeId,
  onEditToggle,
  isEditing,
}: {
  fullName: string;
  pictureUrl?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  employeeId?: number | string | null;
  onEditToggle: () => void;
  isEditing: boolean;
}) {
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <ProfileAvatar fullName={fullName} pictureUrl={pictureUrl} />
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-bold text-dark truncate">{fullName}</h2>
        {jobTitle || department || employeeId ? (
          <div className="text-xs text-gray-400 mt-1 space-y-0.5">
            {jobTitle && <p className="truncate">{jobTitle}</p>}
            {department && <p className="truncate">{department}</p>}
            {employeeId !== undefined && employeeId !== null && (
              <p className="truncate">Employee ID: {employeeId}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-1">
            Job title, department, and employee ID aren't available from the API yet — see
            CHANGELOG.md.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onEditToggle}
        className="w-full sm:w-auto px-5 py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors flex-shrink-0 active:scale-[0.97] transition-transform duration-100"
        aria-label={isEditing ? "Cancel editing profile" : "Edit profile"}
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-dark break-words">{value}</p>
    </div>
  );
}

export function PersonalDetailsCard({ profile }: { profile: Profile | undefined | null }) {
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Personal Details</h3>
      {!profile ? (
        <p className="text-sm text-gray-400">
          No profile on file yet — use "Edit Profile" above to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-5 pl-1">
          <DetailRow label="Gender" value={profile.gender} />
          <DetailRow label="Date of Birth" value={profile.birth_date} />
          <DetailRow label="Phone" value={profile.phone_number} />
          <DetailRow label="Address" value={profile.address} />
        </div>
      )}
    </section>
  );
}

export interface ProfileFormValues {
  gender: Gender;
  birth_date: string;
  phone_number: string;
  address: string;
  picture: File | null;
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
  const [gender, setGender] = useState<Gender>(initialValues?.gender ?? "male");
  const [birthDate, setBirthDate] = useState(initialValues?.birth_date ?? "");
  const [phone, setPhone] = useState(initialValues?.phone_number ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [picture, setPicture] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requirePicture && !picture) return;
    onSubmit({
      gender,
      birth_date: birthDate,
      phone_number: phone,
      address,
      ...(picture ? { picture } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      {errorMessage && (
        <p role="alert" className="text-xs text-red-600">
          {errorMessage}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="profile-gender" className="block text-xs text-gray-500 mb-1">
            Gender
          </label>
          <select
            id="profile-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="profile-birth-date" className="block text-xs text-gray-500 mb-1">
            Date of birth
          </label>
          <input
            id="profile-birth-date"
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="block text-xs text-gray-500 mb-1">
            Phone number
          </label>
          <input
            id="profile-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <div>
          <label htmlFor="profile-address" className="block text-xs text-gray-500 mb-1">
            Address
          </label>
          <input
            id="profile-address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
      </div>
      <div>
        <label htmlFor="profile-picture" className="block text-xs text-gray-500 mb-1">
          Picture {requirePicture ? "" : "(optional — leave empty to keep current)"}
        </label>
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          required={requirePicture}
          onChange={(e) => setPicture(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-green-light file:text-green-dark file:text-xs"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving…" : "Save Profile"}
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
  const [idCard, setIdCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [bankInfo, setBankInfo] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!idCard || !photo || !bankInfo) return;
    onUpload({ id_card: idCard, photo, bank_info: bankInfo });
  }

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Documents</h3>
      {status ? (
        <div className="mb-4 rounded-2xl border border-green-light bg-green/5 p-4 text-sm text-dark">
          {status.completed ? (
            <div className="space-y-2">
              <p className="font-semibold text-dark">Onboarding documents uploaded</p>
              {status.uploaded_documents.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Uploaded documents:</p>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {status.uploaded_documents.map((item) => (
                      <li key={item}>{item.replace(/_/g, " ")}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-dark">Onboarding documents required</p>
              <p className="text-xs text-gray-500">Upload the missing documents below to complete onboarding.</p>
              {status.missing_documents.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Missing documents:</p>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {status.missing_documents.map((item) => (
                      <li key={item}>{item.replace(/_/g, " ")}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
        <p className="text-xs text-gray-400">Upload onboarding documents:</p>
        <div>
          <label htmlFor="id_card" className="block text-xs text-gray-500 mb-1">
            ID Card
          </label>
          <input
            id="id_card"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-green-light file:text-green-dark file:text-xs"
          />
        </div>
        <div>
          <label htmlFor="photo" className="block text-xs text-gray-500 mb-1">
            Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-green-light file:text-green-dark file:text-xs"
          />
        </div>
        <div>
          <label htmlFor="bank_info" className="block text-xs text-gray-500 mb-1">
            Bank Information
          </label>
          <input
            id="bank_info"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setBankInfo(e.target.files?.[0] ?? null)}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-green-light file:text-green-dark file:text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading || !idCard || !photo || !bankInfo}
          className="w-full flex items-center justify-center gap-2 py-2 bg-green-light text-green-dark rounded-xl text-xs font-medium hover:bg-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={14} />
          {isUploading ? "Uploading…" : "Upload"}
        </button>
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
  // CONFIRMED via live backend testing: `GET /profiles` includes a
  // `manager` field (the manager's name) — this used to be flagged as
  // unavailable, but it just lives on the profile response, not the
  // contract one.
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
