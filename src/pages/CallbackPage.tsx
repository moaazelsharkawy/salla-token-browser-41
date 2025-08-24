import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. استخراج التوكن من رابط الـ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('jwt');

    if (token) {
      // 2. تخزين التوكن بشكل آمن في التخزين المحلي
      localStorage.setItem('userToken', token);
      
      // 3. إزالة التوكن من الرابط لأغراض أمنية
      window.history.replaceState({}, document.title, window.location.pathname);

      // 4. توجيه المستخدم إلى الصفحة الرئيسية
      navigate('/');
    } else {
      // إذا لم يكن هناك توكن، توجيه إلى الصفحة الرئيسية
      navigate('/');
    }
  }, [navigate]);

  // عرض رسالة تحميل أثناء معالجة التوكن
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner isVisible={true} />
        <p className="text-lg font-semibold text-muted-foreground">
          جاري تسجيل الدخول...
        </p>
      </div>
    </div>
  );
};

export default CallbackPage;