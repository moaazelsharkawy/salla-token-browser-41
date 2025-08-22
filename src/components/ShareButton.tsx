import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export const ShareButton = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const shareData = {
    title: 'Salla Token Network - أول عملة رقمية عربية على شبكة سولانا - First Arabic Cryptocurrency on Solana',
    text: 'أول عملة رقمية عربية مبنية على شبكة سولانا بلوك تشين، تستخدم في المدفوعات والتجارة الإلكترونية - The first Arabic cryptocurrency built on Solana blockchain, used for payments and e-commerce',
    url: window.location.href
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: i18n.language === 'ar' ? 'تم المشاركة بنجاح' : 'Shared successfully',
          description: i18n.language === 'ar' ? 'تم مشاركة التطبيق' : 'App shared successfully'
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: i18n.language === 'ar' ? 'تم نسخ الرابط' : 'Link copied',
          description: i18n.language === 'ar' ? 'تم نسخ رابط التطبيق إلى الحافظة' : 'App link copied to clipboard'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: i18n.language === 'ar' ? 'خطأ في المشاركة' : 'Share error',
        description: i18n.language === 'ar' ? 'حدث خطأ أثناء المشاركة' : 'An error occurred while sharing',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex justify-center pb-8 pt-4">
      <Button
        onClick={handleShare}
        variant="outline"
        size="lg"
        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {navigator.share ? (
          <Share2 className="w-5 h-5 text-primary" />
        ) : (
          <Copy className="w-5 h-5 text-primary" />
        )}
        <span className="font-semibold text-foreground">
          {i18n.language === 'ar' ? 'مشاركة التطبيق' : 'Share App'}
        </span>
      </Button>
    </div>
  );
};