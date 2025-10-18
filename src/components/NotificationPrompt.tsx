import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NotificationPromptProps {
  onAccept: () => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export const NotificationPrompt = ({ onAccept, onDismiss, isLoading = false }: NotificationPromptProps) => {
  const handleAccept = () => {
    console.log('👆 User clicked Accept button');
    onAccept();
  };

  const handleDismiss = () => {
    console.log('👆 User clicked Dismiss button');
    onDismiss();
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              تفعيل الإشعارات
            </h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              اسمح لنا بإرسال إشعارات لك للبقاء على اطلاع بآخر التحديثات والعروض المهمة
            </p>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1 h-8 text-xs"
              >
                <Bell className="w-3 h-3 ml-1" />
                {isLoading ? 'جاري التفعيل...' : 'السماح'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                disabled={isLoading}
                className="px-3 h-8 text-xs"
              >
                لاحقاً
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                disabled={isLoading}
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
