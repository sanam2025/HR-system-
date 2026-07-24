// src/core/modules/HR/pages/Announcements/Announcements.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Send, Eye, X } from 'lucide-react';
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  usePublishAnnouncement,
} from '../../hooks/useAnnouncements';
import type { 
  CreateAnnouncementData,
  Announcement 
} from '../../../../../api/service/HrService/Types/AnnouncementsService.types';

export default function Announcements() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { announcements, isLoading, refetch } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const publishAnnouncement = usePublishAnnouncement();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: '',
    content: '',
    audience: 'all',
    status: 'draft',
    starts_at: '',
    ends_at: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAnnouncement.mutateAsync({ id: editingId, data: formData });
    } else {
      await createAnnouncement.mutateAsync(formData);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', content: '', audience: 'all', status: 'draft', starts_at: '', ends_at: '' });
    refetch();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement.mutate(id, { onSuccess: () => refetch() });
    }
  };

  const handlePublishNow = (id: number) => {
    publishAnnouncement.mutate(id, { onSuccess: () => refetch() });
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title,
      content: ann.content,
      audience: ann.audience,
      status: ann.status === 'expired' ? 'draft' : ann.status,
      starts_at: ann.starts_at,
      ends_at: ann.ends_at || '',
    });
    setShowForm(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-gray-100 text-gray-500',
      expired: 'bg-gray-200 text-gray-400',
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.draft}`}>{status}</span>;
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, audience: e.target.value as CreateAnnouncementData['audience'] });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, status: e.target.value as CreateAnnouncementData['status'] });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('manageAnnouncements') || 'Manage Announcements'}</h1>
          <p className="text-gray-500 text-sm">{t('createManageAnnouncements') || 'Create and manage announcements for employees'}</p>
        </div>
        {/* تم حذف زر Add Announcement من هنا */}
        {/* <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', content: '', audience: 'all', status: 'draft', starts_at: '', ends_at: '' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Announcement
        </button> */}
      </div>

      {/* Form Modal (يظهر عند التعديل فقط) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? (t('editAnnouncement') || 'Edit Announcement') : (t('addAnnouncement') || 'Add Announcement')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select value={formData.audience} onChange={handleAudienceChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="all">All</option>
                  <option value="employees">Employees</option>
                  <option value="managers">Managers</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="datetime-local" value={formData.starts_at} onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                <input type="datetime-local" value={formData.ends_at} onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={handleStatusChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">{editingId ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('titleStar') || 'Title'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('audience') || 'Audience'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status') || 'Status'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('startDate') || 'Start Date'}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((ann, idx) => (
                <tr key={ann.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ann.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{ann.audience}</td>
                  <td className="px-4 py-3">{getStatusBadge(ann.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(ann.starts_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(ann)} className="p-1 text-blue-500 hover:text-blue-700" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(ann.id)} className="p-1 text-red-500 hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      {ann.status !== 'active' && (
                        <button onClick={() => handlePublishNow(ann.id)} className="p-1 text-green-500 hover:text-green-700" title="Publish Now"><Send className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => navigate(`/Hr/announcements/${ann.id}`)} className="p-1 text-gray-500 hover:text-gray-700" title="View"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{t('noAnnouncements') || 'No announcements found'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}