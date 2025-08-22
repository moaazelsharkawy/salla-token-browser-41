import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, Sun, Moon, Globe, Github, Facebook, FileText, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/moaazelsharkawy/salla-token-browser/blob/main/README.md' },
    { icon: () => <span className="text-sm font-bold">𝕏</span>, label: 'X', url: 'https://twitter.com/pisallashop' },
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
        
        <div className="space-y-6 mt-8">
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
            <h3 className="text-lg font-semibold">{t('theme')}</h3>
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
            <h3 className="text-lg font-semibold">{i18n.language === 'ar' ? 'الورقة البيضاء' : 'White Paper'}</h3>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 hover:scale-105 transition-all"
              onClick={() => window.open('https://paper.salla-shop.com', '_blank')}
            >
              <FileText size={16} />
              {i18n.language === 'ar' ? 'الورقة البيضاء' : 'White Paper'}
            </Button>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('social')}</h3>
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
      </SheetContent>
    </Sheet>
  );
}