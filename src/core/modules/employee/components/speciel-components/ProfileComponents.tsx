import { Plus, FileText, Image } from "lucide-react";
import { Badge } from "../commend-components";
import { useTranslation } from "react-i18next";
import { DocumentType } from "../../types";
import type { EmployeeProfile, Document, EmploymentStatus } from "../../types";

function FileIcon({ type }: { type: DocumentType }) {
  if (type === DocumentType.Image) return <Image size={18} className="text-brown" aria-hidden="true" />;
  return <FileText size={18} className="text-red-500" aria-hidden="true" />;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-dark break-words">{value}</p>
    </div>
  );
}

export function ProfileHeader({ profile }: { profile: EmployeeProfile }) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0"
        aria-label={`${profile.fullName}'s avatar`}
      >
        {profile.avatar}
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-bold text-dark truncate">{profile.fullName}</h2>
        <p className="text-green font-medium text-sm">{t(profile.jobTitle)}</p>
        <div className="flex gap-2 mt-2 justify-center sm:justify-start flex-wrap">
          <Badge>{profile.employeeId}</Badge>
          <Badge>{t(profile.department)}</Badge>
        </div>
      </div>
        <button
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors flex-shrink-0 active:scale-[0.97] transition-transform duration-100"
          aria-label="Edit profile"
        >
          {t('editProfile')}
        </button>
    </section>
  );
}

export function PersonalDetailsCard({ details }: { details: Record<string, string> }) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">{t('personalDetails')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-5 pl-1">
        {Object.entries(details).map(([key, value]) => (
          <DetailRow key={key} label={t(key)} value={value} />
        ))}
      </div>
    </section>
  );
}

function DocumentItem({ doc, index }: { doc: Document; index: number }) {
  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors animate-slide-up-stagger"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="w-9 h-9 rounded-lg bg-beige flex items-center justify-center" aria-hidden="true">
        <FileIcon type={doc.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark truncate">{doc.name}</p>
        <p className="text-xs text-gray-400">{doc.size}</p>
      </div>
    </div>
  );
}

export function DocumentsCard({ documents }: { documents: Document[] }) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm font-semibold text-dark">{t('documents')}</h3>
        <button
          type="button"
          className="w-7 h-7 rounded-lg bg-green-light flex items-center justify-center hover:bg-green/20 transition-colors"
          aria-label="Add new document"
        >
          <Plus size={16} className="text-green" />
        </button>
      </header>
      <div className="space-y-3">
        {documents.map((doc, i) => (
          <DocumentItem key={doc.id} doc={doc} index={i} />
        ))}
      </div>
    </section>
  );
}

export function EmploymentStatusCard({ status }: { status: EmploymentStatus }) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-4 sm:mb-5">{t('employmentStatus')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t('joinDate')}</p>
          <p className="text-sm font-medium text-dark">{status.joinDate}</p>
          <p className="text-xs text-green font-medium mt-0.5">{status.tenure}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">{t('contractType')}</p>
          <p className="text-sm font-medium text-dark">{t(status.contractType)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">{t('manager')}</p>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              aria-label={`${status.manager.name}'s avatar`}
            >
              {status.manager.avatar}
            </div>
            <span className="text-sm font-medium text-dark truncate">{status.manager.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
