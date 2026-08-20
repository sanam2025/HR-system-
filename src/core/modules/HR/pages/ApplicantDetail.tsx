// src/core/modules/HR/pages/ApplicantDetail.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../../../api/client';
import Loading from '../../../../shared/components/Loading';

//  تعريف الأنواع الخاصة بالمتقدم
interface Skill {
  id: number;
  name: string;
}

interface JobPosting {
  id: number;
  job_title: string;
  description: string;
  status: string;
  posted_at: string;
}

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  cover_letter: string | null;
  more_skill: string | null;
  status: string;
  experience: number;
  skills: Skill[];
  matched_skills: Skill[];
  cv_url: string | null;
  job_posting: JobPosting;
  created_at: string;
}

export default function ApplicantDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const candidateId = parseInt(id || '0');

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // جلب بيانات المتقدم
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await apiClient.get(`/candidates/${candidateId}`);
        setCandidate(res.data?.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load candidate details');
      } finally {
        setIsLoading(false);
      }
    };
    if (candidateId) fetchCandidate();
  }, [candidateId]);

  // دالة تحميل السيرة الذاتية (CV)
  const handleDownloadCV = async () => {
    if (!candidate?.cv_url) {
      toast.error('No CV available');
      return;
    }
    setDownloading(true);
    try {
      // فتح الرابط في نافذة جديدة للتحميل
      window.open(candidate.cv_url, '_blank');
    } catch {
      toast.error('Failed to download CV');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!candidate) return <p className="text-red-500">Candidate not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate('/Hr/job-postings')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* رأس البطاقة */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.full_name}</h1>
            <p className="text-gray-500 text-sm">{candidate.email}</p>
          </div>
          {candidate.cv_url && (
            <button
              onClick={handleDownloadCV}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Downloading...' : 'Download CV'}
            </button>
          )}
        </div>

        {/* محتوى البطاقة */}
        <div className="space-y-4">
          {/* الخبرة */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Experience</h3>
            <p className="text-gray-600">{candidate.experience} years</p>
          </div>

          {/* رسالة الغلاف */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Cover Letter</h3>
            <p className="text-gray-600">{candidate.cover_letter || 'No cover letter provided.'}</p>
          </div>

          {/* المهارات */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill: Skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* الحالة */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Status</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {candidate.status}
            </span>
          </div>

          {/* الوظيفة المتقدم لها */}
          {candidate.job_posting && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700">Job Posting</h3>
              <p className="text-gray-600 font-medium">{candidate.job_posting.job_title}</p>
              <p className="text-gray-500 text-sm">{candidate.job_posting.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}