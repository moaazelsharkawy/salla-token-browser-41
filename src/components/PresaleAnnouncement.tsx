import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, Rocket, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/hooks/useLoading';

const PRESALE_SHOWN_KEY = 'salla-presale-announcement-shown';

export const PresaleAnnouncement = () => {
  const { t } = useTranslation();
  const { handleExternalLink } = useLoading();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if announcement has been shown before
    const hasBeenShown = localStorage.getItem(PRESALE_SHOWN_KEY);
    
    if (!hasBeenShown) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(PRESALE_SHOWN_KEY, 'true');
  };

  const handlePresaleClick = () => {
    handleClose();
    handleExternalLink('https://sallanet.com/st-presale');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Close button */}
        <DialogClose 
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 space-y-6">
          {/* Icon badges */}
          <div className="flex justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center animate-bounce">
              <Rocket className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.1s' }}>
              <Sparkles className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
              {t('presale.title')}
            </h2>
            
            {/* Description */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('presale.description')}
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePresaleClick}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Rocket className="w-5 h-5 mr-2" />
            {t('presale.button')}
          </Button>

          {/* Subtle footer text */}
          <p className="text-center text-xs text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            ✨ {t('presale.close')} {t('presale.button').toLowerCase()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
