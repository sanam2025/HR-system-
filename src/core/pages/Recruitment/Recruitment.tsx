import { useState } from 'react';
import { Send, ClipboardList, Loader2, Briefcase, Calendar, CheckCircle2, Clock, XCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobRequisition, getJobRequisitions, updateJobRequisition, deleteJobRequisition, getSkills, createSkill } from '../../../api/recruitment';

export default function Recruitment() {
  const { t, lang } = useLanguage();
  const r = t.recruitment;
  const v = r.vacancy;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: '',
    description: '',
    experience: 1,
    skills: [] as number[],
  });
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);  const { data: rawRequisitions = [], isLoading: isRequisitionsLoading } = useQuery({
    queryKey: ['my-job-requisitions'],
    queryFn: getJobRequisitions
  });  const { data: skillsList = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills
  });

  const requisitionsList = Array.isArray(rawRequisitions) ? rawRequisitions : Array.isArray(rawRequisitions?.data) ? rawRequisitions.data : [];

  const createMutation = useMutation({
    mutationFn: createJobRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-job-requisitions'] });
      toast.success(v.toasts?.success || 'تم إرسال طلب الاحتياج الوظيفي بنجاح ✅');
      setForm({ title: '', description: '', experience: 1, skills: [] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'حدث خطأ أثناء إرسال طلب الاحتياج الوظيفي';
      toast.error(msg);
    }
  });

  const createSkillMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: (newSkill) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setForm(prev => ({ ...prev, skills: [...prev.skills.filter(id => id !== newSkill.id), newSkill.id] }));
      setCustomSkill('');
      toast.success(lang === 'ar' ? 'تمت إضافة المهارة الجديدة ✅' : 'New skill added successfully ✅');
    },
    onError: () => toast.error(lang === 'ar' ? 'حدث خطأ أثناء إضافة المهارة' : 'Error adding skill')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateJobRequisition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-job-requisitions'] });
      toast.success(lang === 'ar' ? 'تم تعديل طلب الاحتياج بنجاح ✅' : 'Job requisition updated successfully ✅');
      setForm({ title: '', description: '', experience: 1, skills: [] });
      setEditingId(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || (lang === 'ar' ? 'حدث خطأ أثناء تعديل طلب الاحتياج' : 'Error updating job requisition');
      toast.error(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-job-requisitions'] });
      toast.success(lang === 'ar' ? 'تم حذف طلب الاحتياج بنجاح 🗑️' : 'Job requisition deleted successfully 🗑️');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || (lang === 'ar' ? 'حدث خطأ أثناء حذف طلب الاحتياج' : 'Error deleting job requisition');
      toast.error(msg);
    }
  });

  const toggleSkill = (skillId: number) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const availableSkills = skillsList.filter((s: any) => !form.skills.includes(s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error(v.toasts?.fillAll || 'يرجى إدخال مسمى الوظيفة المطلوب');
      return;
    }

    const payload = {
      job_title: form.title,
      description: form.description,
      experience: Number(form.experience),
      skills: form.skills,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (req: any) => {
    setEditingId(req.id);
    setForm({
      title: req.job_title || req.title || '',
      description: req.description || '',
      experience: req.experience || 1,
      skills: Array.isArray(req.skills) ? req.skills.map((s: any) => typeof s === 'object' ? s.id : Number(s)) : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف طلب الاحتياج؟' : 'Are you sure you want to delete this requisition?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', experience: 1, skills: [] });
  };

  const getRequisitionStatusBadge = (status: string) => {
    const isApproved = status === 'approved' || status === 'موافقة' || status === 'معتمد';
    const isRejected = status === 'rejected' || status === 'مرفوضة' || status === 'مرفوض';
    const cls = isApproved ? 'bg-green-50 text-green-700 border-green-200' : isRejected ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
    const label = isApproved ? (lang === 'ar' ? 'معتمد' : 'Approved') : isRejected ? (lang === 'ar' ? 'مرفوض' : 'Rejected') : (lang === 'ar' ? 'قيد النظر (معلق)' : 'Under Review (Pending)');
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      

      <div>
        <h2 className="text-2xl font-extrabold text-dark">{r.title || 'إدارة التوظيف'}</h2>
        <p className="text-sm text-brown mt-1">{r.subtitle || 'إرسال طلبات الاحتياج الوظيفي ومتابعة حالات الاعتماد من إدارة الموارد البشرية'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
          <h3 className="font-bold text-dark text-lg flex items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-green" size={20} />
              {editingId ? (lang === 'ar' ? 'تعديل طلب احتياج وظيفي' : 'Edit Job Requisition') : (v.title || (lang === 'ar' ? 'تقديم طلب احتياج وظيفي جديد' : 'Submit New Job Requisition'))}
            </div>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700">
                {lang === 'ar' ? 'إلغاء التعديل' : 'Cancel Edit'}
              </button>
            )}
          </h3>          <div>
            <label className="form-label">{v.positionTitle || 'المسمى الوظيفي المطلوب'} <span className="text-red-500">*</span></label>
            <input
              className="form-input"
              required
              placeholder={v.positionPlaceholder || 'مثال: مطور ويب، مهندس برمجيات...'}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>          <div>
            <label className="form-label">{v.description || 'الوصف الوظيفي والمسؤوليات'} <span className="text-red-500">*</span></label>
            <textarea
              className="form-input resize-none h-24"
              required
              placeholder={v.descriptionPlaceholder || 'اكتب وصفاً مختصراً للمهام والمسؤوليات المتوقعة...'}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>          <div>
            <label className="form-label">{v.experience || 'سنوات الخبرة المطلوبة'} <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="0"
              className="form-input"
              required
              placeholder="1"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
            />
          </div>          <div>
            <label className="form-label">{v.requirements || 'المهارات والاشتراطات المطلوبة'}</label>

            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.skills.map(skillId => {
                  const skillObj = skillsList.find((s: any) => s.id === skillId);
                  return (
                    <span
                      key={skillId}
                      onClick={() => toggleSkill(skillId)}
                      title={lang === 'ar' ? 'انقر للحذف' : 'Click to remove'}
                      className="flex items-center gap-1.5 bg-green/10 text-green text-xs font-semibold px-3 py-1.5 rounded-full border border-green/20 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                    >
                      {skillObj?.name || `Skill ${skillId}`}
                      <span className="text-[10px] opacity-70">✕</span>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="form-input flex-1 cursor-pointer"
                value={selectedSkill}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val && !form.skills.includes(val)) toggleSkill(val);
                  setSelectedSkill('');
                }}
              >
                <option value="">{v.selectSkill || '-- اختر مهارة --'}</option>
                {availableSkills.map((skill: any) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>

              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder={v.customSkillPlaceholder || 'أو اكتب مهارة مخصصة...'}
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customSkill.trim() && !createSkillMutation.isPending) {
                        createSkillMutation.mutate(customSkill.trim());
                      }
                    }
                  }}
                  disabled={createSkillMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSkill.trim() && !createSkillMutation.isPending) {
                      createSkillMutation.mutate(customSkill.trim());
                    }
                  }}
                  disabled={createSkillMutation.isPending || !customSkill.trim()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold rounded-xl text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createSkillMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : (lang === 'ar' ? 'إضافة' : 'Add')}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="btn-primary py-3 w-full flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50"
          >
            {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {(createMutation.isPending || updateMutation.isPending) ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : editingId ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (v.submitBtn || (lang === 'ar' ? 'إرسال طلب الاحتياج' : 'Submit Requisition'))}
          </button>
        </form>        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h3 className="font-bold text-dark text-base flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Briefcase size={18} className="text-green" />
              {lang === 'ar' ? 'طلبات الاحتياج السابقة' : 'Previous Job Requisitions'}
            </h3>

            {isRequisitionsLoading ? (
              <div className="text-center py-10"><Loader2 className="animate-spin text-green mx-auto" size={24} /></div>
            ) : requisitionsList.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs">{lang === 'ar' ? 'لم تقم بإرسال طلبات احتياج وظيفي بعد' : 'You have not submitted any job requisitions yet'}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pe-1">
                {requisitionsList.map((req: any) => (
                  <div key={req.id} className="bg-gray-50/70 rounded-xl p-3.5 border border-gray-100 hover:border-green/30 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-dark text-sm leading-tight">{req.job_title || req.title}</h4>
                      {getRequisitionStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-brown line-clamp-2">{req.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-200/40">
                      <div className="flex gap-3">
                        <span>🎓 {lang === 'ar' ? 'الخبرة' : 'Experience'}: <strong>{req.experience} {lang === 'ar' ? 'سنة' : 'years'}</strong></span>
                        <span>📅 {req.created_at ? new Date(req.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : ''}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(req)}
                          className="text-blue-500 hover:bg-blue-50 p-1 rounded transition-colors"
                          title={lang === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(req.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors disabled:opacity-50"
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

