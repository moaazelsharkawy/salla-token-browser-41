import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface PWAInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const PWAInstallPrompt = ({ onInstall, onDismiss }: PWAInstallPromptProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              تثبيت التطبيق
            </h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              تثبيتك للتطبيق آمن ويسهل وصولك للنظام. يدعم iPhone وجميع الأجهزة
            </p>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onInstall}
                className="flex-1 h-8 text-xs"
              >
                <Download className="w-3 h-3 ml-1" />
                تثبيت
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDismiss}
                className="px-2 h-8"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};