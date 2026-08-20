import { useState } from "react";
import toast from "react-hot-toast";
import {
  ProfileHeader,
  PersonalDetailsCard,
  ProfileForm,
  DocumentsCard,
} from "../components/speciel-components/ProfileComponents";
import { LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { useMyProfile, useCreateProfile, useUpdateProfile } from "../../../../api/hooks/useProfiles";
import {
  useMyContract,
  useDownloadMyContract,
  useUploadOnboardingDocuments,
  useOnboardingStatus
} from "../../../../api/hooks/useOnboarding";
import useAuthStore from "../../../../store/authStore";
import { ApiError } from "../../../../lib/http/ApiError";
import type { CreateProfilePayload, UpdateProfilePayload, Contract } from "../../../../api/models";
import { FileText, Download, X } from "lucide-react";

function ContractCard({ contract }: { contract: Contract | null | undefined }) {
  const downloadMutation = useDownloadMyContract();

  if (!contract) return null;

  const handleDownload = () => {
    downloadMutation.mutate(undefined, {
      onError: (error: any) => {
        console.error("Download failed:", error);
        toast.error("فشل تحميل العقد. تأكد من أن العقد متوفر.");
      },
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contract.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 border-t-4 border-t-gold h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
        <h2 className="text-base font-bold text-dark flex items-center gap-2">
          <FileText size={20} className="text-gold" />
          تفاصيل العقد (Contract Details)
        </h2>
        <button
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold hover:bg-gold hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          {downloadMutation.isPending ? "جاري التحميل..." : (
            <>
              <Download size={16} />
              تحميل PDF
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">تاريخ البدء (Start Date)</p>
            <p className="text-sm font-bold text-dark">{contract.start_date || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">تاريخ الانتهاء (End Date)</p>
            <p className="text-sm font-bold text-dark">{contract.end_date || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">سعر الساعة (Hour Price)</p>
            <p className="text-sm font-bold text-dark">{contract.hour_price ? `${contract.hour_price} SYP` : "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">ساعات العمل/اليوم (Hours/Day)</p>
            <p className="text-sm font-bold text-dark">{contract.working_hour_per_day || "—"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">أيام العطلة (Weekend Days)</p>
            <p className="text-sm font-bold text-dark">
              {contract.weekend_days?.length ? contract.weekend_days.join("، ") : "—"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-brown mb-1.5 uppercase tracking-wide">قابل للتجديد (Renewable)</p>
            <p className="text-sm font-bold text-dark bg-surface inline-block px-3 py-1 rounded-lg">
              {contract.renewable ? "نعم (Yes)" : "لا (No)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);
  const [picture, setPicture] = useState<File | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  function handleEditToggle() {
    setIsEditing(p => {
      if (p) setPicture(null);
      return !p;
    });
  }

  const profileQuery = useMyProfile();
  const contractQuery = useMyContract();
  const onboardingStatusQuery = useOnboardingStatus();

  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile(profileQuery.data?.id ?? 0);
  
  const uploadDocuments = useUploadOnboardingDocuments();
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const profileNotFound =
    profileQuery.isError && (profileQuery.error as ApiError).kind === "not_found";
  const hasProfile = Boolean(profileQuery.data) && !profileNotFound;

  const savingProfile = createProfile.isPending || updateProfile.isPending;
  const saveError =
    (createProfile.error as ApiError | null)?.message ??
    (updateProfile.error as ApiError | null)?.message ??
    null;

  function handleSave(payload: CreateProfilePayload | UpdateProfilePayload) {
    const finalPayload = { ...payload, ...(picture ? { picture } : {}) };
    if (hasProfile) {
      updateProfile.mutate(finalPayload, { onSuccess: () => { setIsEditing(false); setPicture(null); } });
    } else {
      createProfile.mutate(finalPayload as CreateProfilePayload, { onSuccess: () => { setIsEditing(false); setPicture(null); } });
    }
  }

  function handleUpload(files: { id_card: File; photo: File; bank_info: File }) {
    setUploadSuccess(null);
    uploadDocuments.mutate(files, {
      onSuccess: (response) => {
        setUploadSuccess(response?.message ?? "Documents uploaded successfully.");
      },
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <ProfileHeader
        fullName={user?.fullName ?? "Employee"}
        pictureUrl={picture ? URL.createObjectURL(picture) : (profileQuery.data?.picture_url ?? null)}
        jobTitle={null}
        department={profileQuery.data?.department ?? null}
        onEditToggle={handleEditToggle}
        isEditing={isEditing}
        onPictureChange={setPicture}
        onPictureClick={() => {
          if (profileQuery.data?.picture_url) {
            setIsImageModalOpen(true);
          }
        }}
      />

      {isEditing ? (
        <ProfileForm
          requirePicture={!hasProfile && !picture}
          initialValues={
            profileQuery.data
              ? {
                  gender: profileQuery.data.gender,
                  birth_date: profileQuery.data.birth_date,
                  address: profileQuery.data.address,
                  phone_number: profileQuery.data.phone_number,
                  pictureUrl: profileQuery.data.picture_url,
                }
              : undefined
          }
          onSubmit={handleSave}
          isSubmitting={savingProfile}
          errorMessage={saveError}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col h-full">
              {profileQuery.isLoading ? (
                <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-50 h-full">
                  <LoadingSkeleton />
                </div>
              ) : profileQuery.isError && !profileNotFound ? (
                <QueryErrorNotice message={(profileQuery.error as ApiError).message} />
              ) : (
                <PersonalDetailsCard profile={hasProfile ? profileQuery.data : null} />
              )}
            </div>
            
            <div className="flex flex-col h-full">
              {contractQuery.isLoading ? (
                <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-50 h-full">
                  <LoadingSkeleton />
                </div>
              ) : contractQuery.isError && (contractQuery.error as ApiError).kind !== "not_found" ? (
                <QueryErrorNotice message={(contractQuery.error as ApiError).message} />
              ) : (
                <ContractCard contract={contractQuery.data} />
              )}
            </div>
          </div>

          <div className="w-full">
            <DocumentsCard
              onUpload={handleUpload}
              isUploading={uploadDocuments.isPending}
              errorMessage={(uploadDocuments.error as ApiError | null)?.message ?? null}
              successMessage={uploadSuccess}
              status={
                onboardingStatusQuery.data
                  ? {
                      completed: onboardingStatusQuery.data.completed,
                      uploaded_documents: onboardingStatusQuery.data.uploaded_documents,
                      missing_documents: onboardingStatusQuery.data.missing_documents,
                    }
                  : null
              }
            />
          </div>
        </div>
      )}

      {/* ── Image Modal ── */}
      {isImageModalOpen && profileQuery.data?.picture_url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-4 end-4 text-white hover:text-gray-300 bg-black/40 rounded-full p-2 transition-colors"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X size={24} />
            </button>
            <img 
              src={profileQuery.data.picture_url} 
              alt="Profile Full View" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
