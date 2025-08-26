import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Sun, Moon, Globe, Github, Facebook, FileText, Send, Bot, LogIn, LogOut, Palette, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/moaazelsharkawy/salla-token-browser/tree/main' },
    { icon: XIcon, label: 'X', url: 'https://twitter.com/pisallashop' },
    { icon: Send, label: 'Telegram', url: 'https://telegram.me/pisallashop' },
    { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61555886373555' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="settings-btn">
          <Settings size={20} className="text-white" />
        </button>
      </SheetTrigger>
      <SheetContent 
        side={i18n.language === 'ar' ? 'left' : 'right'} 
        className="w-80 bg-card/95 backdrop-blur-lg border-border/50"
      >
        <SheetHeader className="text-right">
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('settings')}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 mt-8">
            {/* Login/User Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <User size={20} className="text-primary" />
                    {i18n.language === 'ar' ? 'الحساب' : 'Account'}
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="text-primary" />
                    {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </>
                )}
              </h3>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">
                      {i18n.language === 'ar' ? 'مرحباً، ' : 'Welcome, '}
                      <span className="text-primary">{user.user_login}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 hover:scale-105 transition-all"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    {i18n.language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 hover:scale-105 transition-all"
                  onClick={login}
                >
                  <LogIn size={16} />
                  {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Button>
              )}
            </div>

            {/* Language Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                {t('language')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={i18n.language === 'ar' ? 'default' : 'outline'}
                  onClick={() => changeLanguage('ar')}
                  className="w-full transition-all hover:scale-105"
                >
                  العربية
                </Button>
                <Button
                  variant={i18n.language === 'en' ? 'default' : 'outline'}
                  onClick={() => changeLanguage('en')}
                  className="w-full transition-all hover:scale-105"
                >
                  English
                </Button>
              </div>
            </div>

            {/* Theme Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                {t('theme')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className="w-full flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Sun size={16} />
                  {t('lightMode')}
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => theme === 'light' && toggleTheme()}
                  className="w-full flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Moon size={16} />
                  {t('darkMode')}
                </Button>
              </div>
            </div>

            {/* White Paper */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                {i18n.language === 'ar' ? 'الورقة البيضاء' : 'White Paper'}
              </h3>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 hover:scale-105 transition-all"
                onClick={() => window.open('https://paper.salla-shop.com', '_blank')}
              >
                <FileText size={16} />
                {i18n.language === 'ar' ? 'الورقة البيضاء' : 'White Paper'}
              </Button>
            </div>

            {/* ST Telegram Bot */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot size={20} className="text-primary" />
                ST Telegram Bot
              </h3>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 hover:scale-105 transition-all"
                onClick={() => window.open('https://t.me/pisalla_bot', '_blank')}
              >
                <Bot size={16} />
                ST Telegram Bot
              </Button>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users size={20} className="text-primary" />
                {t('social')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:scale-105 transition-all"
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <social.icon size={16} />
                    {social.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}