import { ProfileHeader, PersonalDetailsCard, DocumentsCard, EmploymentStatusCard } from "../components/speciel-components/ProfileComponents";
import { mockProfileData } from "../data/mockEmployeeData";

export default function EmployeeProfile_E() {
  const data = mockProfileData;
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <ProfileHeader profile={data.profile} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <PersonalDetailsCard details={data.personalDetails} />
        </div>
        <div className="lg:col-span-1">
          <DocumentsCard documents={data.documents} />
        </div>
      </div>
      <EmploymentStatusCard status={data.employmentStatus} />
    </div>
  );
}
