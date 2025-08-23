import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  isVisible: boolean;
  className?: string;
}

export function LoadingSpinner({ isVisible, className }: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm",
      "transition-all duration-300",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        {/* Modern Spinning Logo */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-spin">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary animate-spin" 
                 style={{ animationDuration: '1s' }} />
          </div>
          
          {/* Inner Ring */}
          <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-2 border-secondary/30 animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent border-b-secondary animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            جاري التحميل...
          </p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}