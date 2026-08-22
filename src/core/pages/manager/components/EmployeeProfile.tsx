import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEmployeeProfile, getEmployeeContract, getEmployeeDocuments, getEmployeeContractDownloadUrl, getEmployeeDocumentDownloadUrl, getEmployeePerformanceSummary, getTasks, getMyProfile, downloadEmployeeContract, downloadEmployeeDocument } from '../../../../api/manager';
import { ArrowRight, ArrowLeft, Phone, Mail, Calendar, Star, CheckSquare, Clock, Loader2, MapPin, User, Briefcase, FileText, Download, File, Edit2, X } from 'lucide-react';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';
import { useAuthStore } from '../../../../store/authStore';
import EditProfileModal from './EditProfileModal';
import toast from 'react-hot-toast';

import { TASK_STATUS_COLORS, TASK_STATUS_EN, CHART_MONTHS_EN, ATTENDANCE_STATUS_INFO } from '../../../constants';
function renderStars(rating: number) {
  const normalizedRating = rating > 5 ? (rating / 20) : rating;
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-lg ${i < Math.round(normalizedRating) ? 'text-gold' : 'text-gray-200'}`}>★</span>
  ));
}
export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isRTL } = useLanguage();
  const ep = t.employeeProfile;
  const es = t.employees.status;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [empTasks, setEmpTasks] = useState<any[]>([]);
  const [hasPerformanceAccess, setHasPerformanceAccess] = useState(true);
  const [hasTasksAccess, setHasTasksAccess] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const currentUser = useAuthStore(state => state.currentUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [downloadingContract, setDownloadingContract] = useState(false);
  const [downloadingDocument, setDownloadingDocument] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      let data = null;
      try {
        data = id ? await getEmployeeProfile(Number(id)) : await getMyProfile();
      } catch (err) {
        console.warn("Profile fetch failed or not found.");
      }

      let profile = data?.data || data;
      let isProfileExists = !!profile;      if (!profile && !id && currentUser) {
        profile = {
          id: currentUser.id,
          name: currentUser.name || currentUser.full_name || 'بدون اسم',
          email: currentUser.email || '',
          job_title: currentUser.role || 'موظف',
          department: currentUser.department || 'الإدارة',
        };
      }      if (!profile && id) {
        try {
          const { EmployeesService } = await import('../../../../api/service/HrService/EmployeesService');
          const usersRes = await EmployeesService.getEmployees();
          const users = usersRes.data?.data || usersRes.data || [];
          const targetUser = users.find((u: any) => u.id === Number(id));
          if (targetUser) {
            profile = {
               id: targetUser.id,
               name: targetUser.full_name || targetUser.name || 'بدون اسم',
               email: targetUser.email || '',
               job_title: targetUser.position || targetUser.role || 'موظف',
               department: targetUser.department?.name || targetUser.department || '',
            };
            if (targetUser.profile_id) {
               try {
                 const realProfile = await getEmployeeProfile(targetUser.profile_id);
                 if (realProfile?.data || realProfile) {
                   profile = { ...profile, ...(realProfile.data || realProfile) };
                 }
               } catch(e) {
                 console.warn("Failed to fetch real profile using profile_id");
               }
            }
          }
        } catch (e) {
          console.warn("Failed to fetch from EmployeesService fallback.");
        }
      }

      if (!profile) {
        throw new Error("No profile found");
      }

      const deptRaw = profile.department || '';
      const DEPT_MAP: Record<string, string> = {
        'marketing': 'التسويق',
        'hr': 'الموارد البشرية',
        'human resources': 'الموارد البشرية',
        'it': 'تقنية المعلومات',
        'engineering': 'الهندسة',
        'finance': 'المالية',
        'sales': 'المبيعات',
        'operations': 'العمليات',
        'support': 'الدعم الفني',
        'design': 'التصميم',
        'management': 'الإدارة',
        'accounting': 'المحاسبة',
      };
      const deptLower = deptRaw.toLowerCase();
      const deptAr = DEPT_MAP[deptLower] || deptRaw;
      const deptEn = deptRaw.charAt(0).toUpperCase() + deptRaw.slice(1);

      setEmployee({
        id: profile.id || (id ? Number(id) : 0),
        name: profile.user_name || profile.name || profile.user?.name || null,
        title: profile.job_title || profile.title || null,
        department: deptRaw,
        departmentAr: deptAr,
        departmentEn: deptEn,
        email: profile.user_email || profile.email || profile.user?.email || null,
        phone: profile.phone_number || null,
        joinDate: profile.hiring_date || profile.join_date || null,
        gender: profile.gender || '',
        address: profile.address || '',
        birthDate: profile.birth_date || '',
        manager: profile.manager || '',
        avatar: profile.user_name ? profile.user_name.charAt(0).toUpperCase() : (profile.name ? profile.name.charAt(0).toUpperCase() : null),
        picture: profile.picture,
        todayStatus: 'غائب', // Default to absent until fetched
        avgRating: '0.0',
        leaveBalance: profile.leave_balance || 0,
        isProfileExists,
      });

      const targetUserId = profile.user_id || profile.user?.id || (id ? Number(id) : profile.id);

      try {
        const contractRes = await getEmployeeContract(targetUserId);
        setContract(contractRes?.data || contractRes);
      } catch (e) {
        console.error("Contract fetch error:", e);
      }

      try {
        const docsRes = await getEmployeeDocuments(targetUserId);
        const docs = Array.isArray(docsRes?.data) ? docsRes.data : Array.isArray(docsRes) ? docsRes : [];
        setDocuments(docs);
      } catch (e) {
        console.error("Docs fetch error:", e);
      }

      try {
        const perfRes = await getEmployeePerformanceSummary(targetUserId);
        setPerformance(perfRes);
      } catch (e: any) {
        console.error("Performance fetch error:", e);
        setHasPerformanceAccess(false);
      }

      try {
        const { getMyMonthlyAttendance } = await import('../../../../api/manager');
        const { default: apiClient } = await import('../../../../api/axios');
        const attRes = await apiClient.get(`my-monthly-attendance?user_id=${targetUserId}`);
        const attData = attRes.data?.data || attRes.data;
        const attendanceList = Array.isArray(attData) ? attData : [];
        setAttendance(attendanceList);        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayRecord = attendanceList.find((a: any) => a.date === todayStr || a.date?.startsWith(todayStr));
        
        if (todayRecord && todayRecord.status) {
          setEmployee((prev: any) => prev ? { ...prev, todayStatus: todayRecord.status } : prev);
        }
      } catch (e) {
        console.error("Attendance fetch error:", e);
      }

      try {
        const allTasks = await getTasks();
        const empName = profile?.user_name || profile?.name || profile?.user?.name;
        const employeeTasks = allTasks.filter((t: any) =>
          t.assignee?.id === targetUserId ||
          (empName && t.assignee?.name && t.assignee.name.toLowerCase() === empName.toLowerCase())
        );
        setEmpTasks(employeeTasks);
      } catch (e: any) {
        console.error("Tasks fetch error:", e);
        setHasTasksAccess(false);
      }

      try {
        const { LeaveService } = await import('../../../../api/service/HrService/LeaveService');
        const balanceRes = await LeaveService.getBalance(targetUserId);
        const leaveBalance = balanceRes?.data?.annual || (balanceRes as any)?.data?.data?.annual || 0;
        if (leaveBalance > 0) {
           setEmployee((prev: any) => prev ? { ...prev, leaveBalance } : prev);
        }
      } catch (e) {
        console.error("Leave balance fetch error:", e);
      }

    } catch (err) {
      setError('تعذر جلب ملف الموظف (قد لا يوجد ملف شخصي لهذا الموظف بعد في قاعدة البيانات).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const tasksCount = performance?.tasks_assigned_count || empTasks.length || 0;
  const avgRating = performance?.latest_evaluation?.final_score || employee?.avgRating || '0.0';

  const getAttendanceLabel = (status: string) => {
    const info = ATTENDANCE_STATUS_INFO[status];
    if (info) return lang === 'ar' ? info.labelAr : info.labelEn;
    return status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-green">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
        <h3 className="text-xl font-bold text-dark">{error || ep.notFound}</h3>
        <button onClick={() => navigate(-1)} className="btn-primary btn mt-4">
          {ep.backToList}
        </button>
      </div>
    );
  }

  const todayLabel = getAttendanceLabel(employee.todayStatus);
  const info = ATTENDANCE_STATUS_INFO[employee.todayStatus];
  const todayStatusColor = info?.colorClass ?? 'bg-gray-50 text-gray-700';



  const profileStats = [];
  
  if (employee.leaveBalance !== undefined) {
    profileStats.push({ label: ep.leaveBalance, value: `${employee.leaveBalance} ${ep.days}`, bg: 'bg-gold/10 text-yellow-800' });
  }
  if (hasTasksAccess) {
    profileStats.push({ label: ep.totalTasks, value: tasksCount, bg: 'bg-green/10 text-green-700' });
  }
  if (hasPerformanceAccess) {
    profileStats.push({ label: ep.avgRating, value: `${avgRating}`, bg: 'bg-brown/10 text-brown' });
  }

  return (
    <div className="space-y-6">      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-brown hover:text-green transition-colors font-semibold"
      >
        <BackIcon size={16} /> {ep.backToList}
      </button>      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative overflow-hidden">        <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green/20 blur-xl rounded-full"></div>
            <div
              onClick={() => {
                if (employee.picture && !employee.picture.includes('default.jpg')) {
                  setPreviewImage(employee.picture);
                }
              }}
              className={`w-24 h-24 rounded-full bg-gradient-to-br from-green to-green-dark flex items-center justify-center text-white text-4xl font-extrabold flex-shrink-0 relative overflow-hidden ring-4 ring-white shadow-lg ${
                employee.picture && !employee.picture.includes('default.jpg')
                  ? 'cursor-pointer hover:scale-105 hover:ring-green/30 transition-transform active:scale-95'
                  : ''
              }`}
              title={employee.picture && !employee.picture.includes('default.jpg') ? (lang === 'ar' ? 'انقر لعرض الصورة' : 'Click to view photo') : undefined}
            >
              {employee.picture && !employee.picture.includes('default.jpg') && (
                <img
                  src={employee.picture}
                  alt={employee.name}
                  className="absolute inset-0 w-full h-full object-cover object-center z-10 block"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              )}
              <span className={`avatar-fallback ${employee.picture && !employee.picture.includes('default.jpg') ? 'hidden' : 'flex'} items-center justify-center w-full h-full z-0`}>
                {employee.avatar || (lang === 'ar' ? 'م' : 'U')}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-dark tracking-tight">{employee.name || (lang === 'ar' ? 'بدون اسم' : 'Unnamed')}</h2>
            {hasPerformanceAccess && (
              <div className="flex gap-1 mt-3 bg-white/50 w-fit px-3 py-1.5 rounded-full border border-white shadow-sm">{renderStars(Number(avgRating))}</div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-end w-full sm:w-auto">
            <div className={`px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm border border-white/50 backdrop-blur-sm ${todayStatusColor}`}>
              {todayLabel} {ep.today}
            </div>
            {(!id || (currentUser && (currentUser.id === employee.id || currentUser.user_id === employee.id))) && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-white hover:bg-gray-50 text-green border border-green/20 rounded-xl shadow-sm transition-all font-semibold text-sm cursor-pointer"
              >
                <Edit2 size={16} />
                {lang === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-100/60 relative z-10">          {employee.department && (
            <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
              <div className="p-2 bg-green/10 rounded-lg text-green"><Briefcase size={16} /></div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'القسم' : 'Department'}</span>
                <span className="font-semibold truncate">{lang === 'ar' ? employee.departmentAr : employee.departmentEn}</span>
              </div>
            </div>
          )}          <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
            <div className="p-2 bg-green/10 rounded-lg text-green"><Mail size={16} /></div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
              <span className="font-semibold truncate">{employee.email || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
            </div>
          </div>          {employee.address && (
            <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
              <div className="p-2 bg-green/10 rounded-lg text-green"><MapPin size={16} /></div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'العنوان' : 'Address'}</span>
                <span className="font-semibold truncate">{employee.address}</span>
              </div>
            </div>
          )}          {employee.manager && (
            <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
              <div className="p-2 bg-green/10 rounded-lg text-green"><User size={16} /></div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'المدير المباشر' : 'Manager'}</span>
                <span className="font-semibold truncate">{employee.manager}</span>
              </div>
            </div>
          )}          <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
            <div className="p-2 bg-gold/10 rounded-lg text-gold"><Calendar size={16} /></div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ep.joinDate}</span>
              <span className="font-semibold truncate">{employee.joinDate || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
            </div>
          </div>          {employee.birthDate && (
            <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
              <div className="p-2 bg-gold/10 rounded-lg text-gold"><Calendar size={16} /></div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</span>
                <span className="font-semibold truncate">{employee.birthDate}</span>
              </div>
            </div>
          )}          {employee.gender && (
            <div className="flex items-center gap-3 text-sm text-brown bg-white/60 p-3 rounded-xl shadow-sm border border-white">
              <div className="p-2 bg-gold/10 rounded-lg text-gold"><User size={16} /></div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'الجنس' : 'Gender'}</span>
                <span className="font-semibold truncate">
                  {employee.gender === 'male' || employee.gender === 'ذكر'
                    ? (isRTL ? 'ذكر' : 'Male')
                    : employee.gender === 'female' || employee.gender === 'أنثى'
                      ? (isRTL ? 'أنثى' : 'Female')
                      : employee.gender}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profileStats.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 text-center border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${s.bg}`}>
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-2xl font-black tracking-tight">{s.value}</p>
              <p className="text-xs font-bold mt-1 opacity-70 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>      {hasTasksAccess && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
          <h3 className="font-extrabold text-dark flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-green/10 rounded-lg"><CheckSquare size={18} className="text-green" /></div>
            {ep.activeTasks}
          </h3>
        </div>
        {empTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <CheckSquare size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">{ep.noTasks}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {empTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-dark">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium">
                    <Calendar size={12} /> {ep.dueDate} {task.due_date || task.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {(task.score || task.rating) && <span className="bg-gold/10 text-yellow-700 text-sm font-bold px-2 py-1 rounded-lg">{task.score || task.rating}</span>}
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${{
                      'pending': 'bg-blue-50 text-blue-700',
                      'in_progress': 'bg-yellow-50 text-yellow-700',
                      'completed': 'bg-green-50 text-green-700',
                      'overdue': 'bg-red-50 text-red-600',
                      'approved': 'bg-green-50 text-green-700',
                      'rejected': 'bg-red-50 text-red-600'
                    }[task.status as string] || TASK_STATUS_COLORS[task.status] || 'bg-gray-50 text-gray-700'
                    }`}>
                    {lang === 'ar'
                      ? ({
                        'pending': 'قيد الانتظار',
                        'in_progress': 'قيد التنفيذ',
                        'completed': 'مكتملة',
                        'overdue': 'متأخرة',
                        'approved': 'معتمدة',
                        'rejected': 'مرفوضة'
                      }[task.status as string] || task.status)
                      : ({
                        'pending': 'Pending',
                        'in_progress': 'In Progress',
                        'completed': 'Completed',
                        'overdue': 'Overdue',
                        'approved': 'Approved',
                        'rejected': 'Rejected'
                      }[task.status as string] || TASK_STATUS_EN[task.status] || task.status)
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
          <h3 className="font-extrabold text-dark flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-gold/10 rounded-lg"><Clock size={18} className="text-gold" /></div>
            {ep.attendanceRecord}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <Clock size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">{ep.noAttendance}</p>
            </div>
          ) : (
            attendance.map((rec: any, i: number) => {
              const info = ATTENDANCE_STATUS_INFO[rec.status];
              const recDate = rec.date ? new Date(rec.date).toLocaleDateString() : '';
              return (
                <div key={rec.id || i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <span className="text-xs text-gray-500 font-semibold w-24 flex-shrink-0 bg-gray-100 px-2 py-1 rounded-lg text-center">{recDate}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 ${info?.colorClass ?? 'bg-gray-50 text-gray-700'}`}>
                    {lang === 'ar' ? (info?.labelAr ?? rec.status) : (info?.labelEn ?? rec.status)}
                  </span>
                  {(rec.check_in || rec.check_out || rec.checkIn || rec.checkOut) && (
                    <span className="text-sm text-brown font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green"></div> {ep.checkIn} <strong className="text-dark">{rec.check_in || rec.checkIn || '—'}</strong>
                      <span className="text-gray-300 mx-1">|</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> {ep.checkOut} <strong className="text-dark">{rec.check_out || rec.checkOut || '—'}</strong>
                    </span>
                  )}
                  {(rec.late_minutes > 0 || rec.delay > 0) && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg font-bold ms-auto">
                      {ep.delay} {rec.late_minutes || rec.delay} {ep.mins}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
          <h3 className="font-extrabold text-dark flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-blue-50 rounded-lg"><FileText size={18} className="text-blue-600" /></div>
            {ep.contract || 'Contract'}
          </h3>
        </div>
        {!contract ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <FileText size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">{ep.noContract || 'No contract available'}</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500 border border-gray-100">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-dark">{contract.contract_type || contract.type || ep.employmentContract}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{contract.start_date} {contract.end_date ? ` - ${contract.end_date}` : ''}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!id) return;
                  try {
                    setDownloadingContract(true);
                    toast.loading(t.profile?.downloading || 'Downloading...', { id: 'download-contract' });
                    const blob = await downloadEmployeeContract(Number(id));
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'contract.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    toast.success('تم التحميل بنجاح', { id: 'download-contract' });
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || 'فشل التحميل', { id: 'download-contract' });
                  } finally {
                    setDownloadingContract(false);
                  }
                }}
                disabled={downloadingContract}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              >
                <Download size={16} /> {downloadingContract ? (t.profile?.downloading || 'Downloading...') : (ep.download || 'Download')}
              </button>
            </div>
          </div>
        )}
      </div>      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
          <h3 className="font-extrabold text-dark flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-purple-50 rounded-lg"><File size={18} className="text-purple-600" /></div>
            {ep.documents || 'Documents'}
          </h3>
        </div>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <File size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">{ep.noDocuments || 'No documents uploaded'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-500 border border-gray-100">
                    <File size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-dark">{doc.document_type || doc.name || (ep.documentName || 'Document')}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                      <Calendar size={12} /> {(ep.dateAdded || 'Added:')} {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : doc.date || ''}
                    </p>
                  </div>
                </div>
                  <button
                    onClick={async () => {
                      try {
                        setDownloadingDocument(doc.id);
                        toast.loading(t.profile?.downloading || 'Downloading...', { id: `download-doc-${doc.id}` });
                        const blob = await downloadEmployeeDocument(doc.id);
                        const url = window.URL.createObjectURL(new Blob([blob]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `document_${doc.id}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                        toast.success('تم التحميل بنجاح', { id: `download-doc-${doc.id}` });
                      } catch (e: any) {
                        toast.error(e?.response?.data?.message || 'فشل التحميل', { id: `download-doc-${doc.id}` });
                      } finally {
                        setDownloadingDocument(null);
                      }
                    }}
                    disabled={downloadingDocument === doc.id}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
                    title={ep.download || 'Download'}
                  >
                    {downloadingDocument === doc.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileId={employee.isProfileExists ? employee.id : null}
        initialData={{
          address: employee.address,
          picture: employee.picture
        }}
        onSuccess={() => {
          fetchProfile(); // Re-fetch data after successful update
        }}
      />      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-3 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-5 right-5 z-20 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all shadow-lg hover:scale-110"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X size={20} />
            </button>
            <div className="overflow-hidden rounded-2xl bg-gray-950 flex items-center justify-center min-h-[250px]">
              <img
                src={previewImage}
                alt={employee?.name || "Profile Picture"}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>
            {employee?.name && (
              <div className="pt-3 pb-1 px-3 text-center">
                <p className="font-bold text-gray-800 text-base">{employee.name}</p>
                {employee.title && <p className="text-xs text-gray-500 mt-0.5">{employee.title}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}