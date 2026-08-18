import { useState } from "react";
import {
  ProfileHeader,
  PersonalDetailsCard,
  ProfileForm,
  DocumentsCard,
  EmploymentStatusCard,
  ChangePasswordCard,
  ResignationCard,
} from "../components/speciel-components/ProfileComponents";
import { LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { useMyProfile, useCreateProfile, useUpdateProfile } from "../../../../api/hooks/useProfiles";
import {
  useMyContract,
  useUploadOnboardingDocuments,
  useOnboardingStatus,
} from "../../../../api/hooks/useOnboarding";
import { useChangePassword } from "../../../../api/hooks/useAuth";
import { useCreateResignation, useMyResignations } from "../../../../api/hooks/useResignations";
import useAuthStore from "../../../../store/authStore";
import { ApiError } from "../../../../lib/http/ApiError";
import type { CreateProfilePayload, UpdateProfilePayload } from "../../../../api/models";

export default function EmployeeProfile() {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);

  const profileQuery = useMyProfile();
  const contractQuery = useMyContract();
  const onboardingStatusQuery = useOnboardingStatus();

  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile(profileQuery.data?.id ?? 0);
  const uploadDocuments = useUploadOnboardingDocuments();
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const changePassword = useChangePassword();
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const myResignations = useMyResignations();
  const createResignation = useCreateResignation();
  const [resignationSuccess, setResignationSuccess] = useState<string | null>(null);

  const profileNotFound =
    profileQuery.isError && (profileQuery.error as ApiError).kind === "not_found";
  const hasProfile = Boolean(profileQuery.data) && !profileNotFound;

  const savingProfile = createProfile.isPending || updateProfile.isPending;
  const saveError =
    (createProfile.error as ApiError | null)?.message ??
    (updateProfile.error as ApiError | null)?.message ??
    null;

  function handleSave(payload: CreateProfilePayload | UpdateProfilePayload) {
    if (hasProfile) {
      updateProfile.mutate(payload, { onSuccess: () => setIsEditing(false) });
    } else {
      createProfile.mutate(payload as CreateProfilePayload, { onSuccess: () => setIsEditing(false) });
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

  function handleChangePassword(payload: { password: string; password_confirmation: string }) {
    setPasswordSuccess(null);
    changePassword.mutate(payload, {
      onSuccess: (response) => {
        setPasswordSuccess(response?.message ?? "Password updated successfully.");
      },
    });
  }

  function handleCreateResignation(payload: { type: string; reason: string }) {
    setResignationSuccess(null);
    createResignation.mutate(payload, {
      onSuccess: () => {
        setResignationSuccess("Resignation submitted.");
      },
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <ProfileHeader
        fullName={user?.fullName ?? "Employee"}
        pictureUrl={profileQuery.data?.picture_url ?? null}
        jobTitle={null}
        department={profileQuery.data?.department ?? null}
        employeeId={null}
        onEditToggle={() => setIsEditing((prev) => !prev)}
        isEditing={isEditing}
      />

      {isEditing ? (
        <ProfileForm
          requirePicture={!hasProfile}
          initialValues={
            profileQuery.data
              ? {
                  gender: profileQuery.data.gender,
                  birth_date: profileQuery.data.birth_date,
                  phone_number: profileQuery.data.phone_number,
                  address: profileQuery.data.address,
                }
              : undefined
          }
          onSubmit={handleSave}
          isSubmitting={savingProfile}
          errorMessage={saveError}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {profileQuery.isLoading ? (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
                <LoadingSkeleton />
              </div>
            ) : profileQuery.isError && !profileNotFound ? (
              <QueryErrorNotice message={(profileQuery.error as ApiError).message} />
            ) : (
              <PersonalDetailsCard profile={hasProfile ? profileQuery.data : null} />
            )}
          </div>
          <div className="lg:col-span-1">
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

      {contractQuery.isLoading ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
          <LoadingSkeleton />
        </div>
      ) : contractQuery.isError ? (
        <QueryErrorNotice message={(contractQuery.error as ApiError).message} />
      ) : (
        <EmploymentStatusCard contract={contractQuery.data} managerName={profileQuery.data?.manager} />
      )}

      <ChangePasswordCard
        onSubmit={handleChangePassword}
        isSubmitting={changePassword.isPending}
        errorMessage={(changePassword.error as ApiError | null)?.message ?? null}
        successMessage={passwordSuccess}
      />

      <ResignationCard
        resignations={myResignations.data}
        isLoading={myResignations.isLoading}
        errorMessage={(myResignations.error as ApiError | null)?.message ?? null}
        onSubmit={handleCreateResignation}
        isSubmitting={createResignation.isPending}
        submitError={(createResignation.error as ApiError | null)?.message ?? null}
        successMessage={resignationSuccess}
      />
    </div>
  );
}
