import React, { useState, useRef } from "react";
import { ProfileHeader, PersonalDetailsCard, DocumentsCard, EmploymentStatusCard } from "../components/speciel-components/ProfileComponents";
import { mockProfileData } from "../data/mockEmployeeData";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { X, Upload, FileText } from "lucide-react";
import { DocumentType } from "../types";

export default function EmployeeProfile_E() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(mockProfileData);

  // Edit Profile Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: data.profile.fullName,
    jobTitle: data.profile.jobTitle,
    phone: data.profile.phone,
    email: data.profile.email,
    dateOfBirth: data.profile.dateOfBirth,
    nationality: data.profile.nationality,
    maritalStatus: data.profile.maritalStatus,
    address: data.profile.address,
  });

  // Add Document Modal state
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DocumentType>(DocumentType.Pdf);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setEditForm({
      fullName: data.profile.fullName,
      jobTitle: data.profile.jobTitle,
      phone: data.profile.phone,
      email: data.profile.email,
      dateOfBirth: data.profile.dateOfBirth,
      nationality: data.profile.nationality,
      maritalStatus: data.profile.maritalStatus,
      address: data.profile.address,
    });
    setIsEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        fullName: editForm.fullName,
        jobTitle: editForm.jobTitle,
        phone: editForm.phone,
        email: editForm.email,
        dateOfBirth: editForm.dateOfBirth,
        nationality: editForm.nationality,
        maritalStatus: editForm.maritalStatus,
        address: editForm.address,
      },
      personalDetails: {
        ...prev.personalDetails,
        "Full Name": editForm.fullName,
        Phone: editForm.phone,
        Email: editForm.email,
        "Date of Birth": editForm.dateOfBirth,
        Nationality: editForm.nationality,
        "Marital Status": editForm.maritalStatus,
        Address: editForm.address,
      },
    }));
    setIsEditOpen(false);
    toast.success(t("profileUpdated") || "Profile updated successfully!");
  };

  const handleOpenAddDoc = () => {
    setDocName("");
    setDocType(DocumentType.Pdf);
    setSelectedFile(null);
    setIsAddDocOpen(true);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() && !selectedFile) {
      toast.error(t("fillDocumentName") || "Please enter a document name or select a file");
      return;
    }
    const name = docName.trim() || (selectedFile ? selectedFile.name : "New_Document.pdf");
    const size = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "1.2 MB";

    const newDoc = {
      id: Date.now(),
      name,
      type: docType,
      size,
    };

    setData((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
    setIsAddDocOpen(false);
    toast.success(t("documentAdded") || "Document added successfully!");
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <ProfileHeader profile={data.profile} onEdit={handleOpenEdit} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <PersonalDetailsCard details={data.personalDetails} />
        </div>
        <div className="lg:col-span-1">
          <DocumentsCard documents={data.documents} onAddDoc={handleOpenAddDoc} />
        </div>
      </div>
      <EmploymentStatusCard status={data.employmentStatus} />

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            dir={i18n.dir()}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-modal overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base sm:text-lg font-bold text-dark">
                {t("editProfileTitle") || "Edit Profile Information"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label={t("cancel") || "Cancel"}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Full Name") || "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("jobTitleLabel") || "Job Title"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.jobTitle}
                    onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Phone") || "Phone"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Email") || "Email"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Date of Birth") || "Date of Birth"}
                  </label>
                  <input
                    type="text"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Nationality") || "Nationality"}
                  </label>
                  <input
                    type="text"
                    value={editForm.nationality}
                    onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Marital Status") || "Marital Status"}
                  </label>
                  <input
                    type="text"
                    value={editForm.maritalStatus}
                    onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {t("Address") || "Address"}
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-green text-white hover:bg-green-dark text-sm font-medium transition-colors shadow-sm active:scale-[0.97]"
                >
                  {t("saveChanges") || "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            dir={i18n.dir()}
            className="bg-white rounded-2xl w-full max-w-md shadow-modal overflow-hidden animate-slide-up flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base sm:text-lg font-bold text-dark">
                {t("addDocument") || "Add New Document"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDocOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label={t("cancel") || "Cancel"}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {t("documentName") || "Document Name"}
                </label>
                <input
                  type="text"
                  placeholder={t("documentNamePlaceholder") || "e.g., Certificate.pdf"}
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {t("documentType") || "Document Type"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDocType(DocumentType.Pdf)}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      docType === DocumentType.Pdf
                        ? "border-green bg-green/10 text-green font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={18} />
                    {t("pdfDocument") || "PDF Document"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType(DocumentType.Image)}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      docType === DocumentType.Image
                        ? "border-green bg-green/10 text-green font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Upload size={18} />
                    {t("imageDocument") || "Image File"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {t("uploadFile") || "Upload File"}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green hover:bg-green-light/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-light/40 flex items-center justify-center text-green group-hover:scale-110 transition-transform">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-medium text-dark">
                    {selectedFile ? selectedFile.name : (t("chooseFile") || "Choose file or drag & drop here")}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-green font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        if (!docName) {
                          setDocName(file.name);
                        }
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-green text-white hover:bg-green-dark text-sm font-medium transition-colors shadow-sm active:scale-[0.97]"
                >
                  {t("addDocument") || "Add New Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
