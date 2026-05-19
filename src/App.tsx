
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagerLayout from './core/layout/ManagerLayout';

// ── صفحات مؤقتة ──────────────────────────────────────────────────────────
function Page({ title }: { title: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '200px' 
    }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9ca3af' }}>
        {title}
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* إعادة توجيه من الجذر إلى /manager */}
        <Route path="/" element={<Navigate to="/manager" replace />} />
        
        {/* مسارات المدير مع Layout */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Page title="لوحة التحكم" />} />
          <Route path="employees" element={<Page title="الموظفون" />} />
          <Route path="employees/:id" element={<Page title="ملف الموظف" />} />
          <Route path="tasks" element={<Page title="المهام" />} />
          <Route path="leaves" element={<Page title="الإجازات" />} />
          <Route path="overtime" element={<Page title="العمل الإضافي" />} />
          <Route path="attendance" element={<Page title="الحضور" />} />
          <Route path="evaluation" element={<Page title="التقييم الدوري" />} />
          <Route path="recruitment" element={<Page title="التوظيف" />} />
        </Route>
        
        {/* أي مسار غير موجود يعيد التوجيه إلى /manager */}
        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
