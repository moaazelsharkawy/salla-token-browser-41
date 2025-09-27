import { useState, useEffect } from 'react';

// استدعاء المفتاح من متغيرات البيئة
// VITE_API_KEY هو الاسم الذي قمنا بتعيينه في Vercel
const API_KEY = import.meta.env.VITE_API_KEY; 

interface User {
  user_id: number;
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
    const token = localStorage.getItem('userToken');

    if (token) {
      try {
        const response = await fetch('https://sallanet.com/wp-json/auth/v1/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 🔑 استخدام المتغير هنا
            'X-API-Key': API_KEY, 
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth Error:', error);
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

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://sallanet.com/wp-json/auth/v1/login', {
        method: 'POST',
        headers: {
          // 🔑 استخدام المتغير هنا
          'X-API-Key': API_KEY, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    setIsAuthenticated(false);
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
