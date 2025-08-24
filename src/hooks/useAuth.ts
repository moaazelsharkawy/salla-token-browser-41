import { useState, useEffect } from 'react';

interface User {
  user_login: string;
  user_email?: string;
  display_name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    // استرجاع التوكن من التخزين المحلي
    const token = localStorage.getItem('userToken');

    if (token) {
      try {
        // إرسال طلب API باستخدام التوكن
        const response = await fetch('https://salla-shop.com/wp-json/myplugin/v1/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        // إذا كان التوكن غير صالح، سيتم الحصول على خطأ
        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        
        // إذا كان الرد ناجحًا، قم بتخزين بيانات المستخدم
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        // التعامل مع الخطأ (مثلاً: حذف التوكن غير الصالح من التخزين المحلي)
        console.error('API Error:', error);
        localStorage.removeItem('userToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = () => {
    window.open('https://salla-shop.com/my-account/', '_blank');
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth: checkAuthStatus
  };
};